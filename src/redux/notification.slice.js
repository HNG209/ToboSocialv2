import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuthUser } from "./auth.slice";
import {
  fetchMoreNotificationsAPI,
  markAsReadAPI,
} from "../services/notification.service";

// Đánh dấu bình luận đã đọc
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const notif = state.notification.notifications;
      const index = notif.findIndex((i) => i.baseId === notificationId);
      if (index !== -1) {
        if (notif[index].isRead) return null;
      }

      await markAsReadAPI(notificationId);
      return notificationId;
    } catch (error) {
      console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Tải thêm thông báo cũ hơn
export const fetchMoreNotifications = createAsyncThunk(
  "notification/fetchMoreNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const page = state.notification.page || 1;
      const fetchMore = state.notification.fetchMore;

      if (!fetchMore) return [];

      return await fetchMoreNotificationsAPI(page);
    } catch (error) {
      console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// state lưu trữ thông báo hiện tại của người dùng, refresh => lấy 10 thông báo mới nhất trong subset của user
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unRead: 0,
    page: 1,
    fetchMore: true,
    status: "idle",
  },
  reducers: {
    appendNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
      state.unRead++;
    },
  },
  extraReducers: (builder) => {
    builder
      // lắng nghe bên auth slice, khi fecth user sẽ có sẵn subset notification, không cần phải fetch riêng nữa
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.notifications = action.payload.latestNotifications; // subset của user hiện tại đang đăng nhập
        state.unRead = action.payload.unRead;
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        if (!action.payload) return;

        const index = state.notifications.findIndex(
          (i) => i.baseId === action.payload.toString()
        );

        if (index === -1) return;

        state.notifications[index].isRead = true;
        state.unRead--;
      })

      .addCase(fetchMoreNotifications.pending, (state) => {
        state.status = "loading"; // hiển thị trực quan lên UI
      })
      .addCase(fetchMoreNotifications.fulfilled, (state, action) => {
        state.status = "success";
        if (action.payload.length === 0) {
          state.fetchMore = false;
          return;
        }
        state.notifications = [...state.notifications, ...action.payload];
        state.page++;
      });
  },
});

export const { appendNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
