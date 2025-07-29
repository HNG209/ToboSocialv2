import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserFeedAPI } from "../services/feed.service";

export const fetchUserFeed = createAsyncThunk(
  "feed/fetchUserFeed",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const result = await fetchUserFeedAPI(page, limit);
      return result;
    } catch (error) {
      console.error("Error in fetchPostByUser:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// newsfeed
const feedSlice = createSlice({
  name: "feed",
  initialState: {
    posts: [], // Danh sách bài viết
    status: "idle", // Trạng thái tải dữ liệu
    pagination: null, // Trạng thái phân trang
    error: null, // Lỗi nếu có
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFeed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserFeed.fulfilled, (state, action) => {
        console.log(action.payload);
        state.posts = action.payload;
      });
  },
});

// export const { setStatus } = profileSlice.actions;
export default feedSlice.reducer;
