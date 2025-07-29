import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserFeedAPI } from "../services/feed.service";
import { toggleLike } from "./post.slice";

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
        state.posts = action.payload;
      })

      .addCase(toggleLike.fulfilled, (state, action) => {
        const {
          postId,
          result: { isLiked },
        } = action.payload;

        const index = state.posts.findIndex((p) => p._id === postId);
        if (index === -1) return;
        state.posts[index].isLiked = isLiked;
        state.posts[index].likeCount = isLiked
          ? state.posts[index].likeCount + 1
          : state.posts[index].likeCount - 1;
      });
  },
});

// export const { setStatus } = profileSlice.actions;
export default feedSlice.reducer;
