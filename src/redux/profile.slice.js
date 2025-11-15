import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMyPostsAPI,
  fetchPostByUserAPI,
  followUserAPI,
  getUserByIdAPI,
  unfollowUserAPI,
} from "../services/user.service";
import {
  fetchProfileSharedPosts,
  fetchSharedPostByUserAPI,
} from "../services/share.service";
import { createPost, deletePost, toggleLike } from "./post.slice";

export const fetchPostByUser = createAsyncThunk(
  "profile/fetchPostByUser",
  async ({ id, page, limit }, { rejectWithValue }) => {
    try {
      if (id) return await fetchPostByUserAPI(id, page, limit);
      return await fetchMyPostsAPI(page, limit);
    } catch (error) {
      console.error("Error in fetchPostByUser:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSharedPostByUser = createAsyncThunk(
  "profile/fetchSharedPostByUser",
  async ({ id, page, limit }, { rejectWithValue }) => {
    try {
      if (id) return await fetchSharedPostByUserAPI(id, page, limit);
      return await fetchProfileSharedPosts(page, limit);
    } catch (error) {
      console.error("Error in fetchSharedPostByUser:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "profile/getCurrentUser",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await getUserByIdAPI(id);
    } catch (error) {
      console.error("Error in getUserById:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  "profile/followUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await followUserAPI(id);
      return response;
    } catch (error) {
      console.error("Error in followUser:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "profile/unfollowUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await unfollowUserAPI(id);
      return response;
    } catch (error) {
      console.error("Error in unfollowUser:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null, // Thông tin người dùng hiện tại
  posts: [], // Danh sách bài viết
  tab: "posts", // Tab hiện tại (posts | shared | saved | tags)
  postDetail: null, // Chi tiết bài viết
  status: "idle", // Trạng thái tải dữ liệu
  error: null, // Lỗi nếu có
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload; // payload là giá trị status mới, ví dụ: 'idle', 'loading', v.v.
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (p) => p._id !== action.payload.postId
        );
      })

      // from post slice
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })

      // .addCase(updatePost.fulfilled, (state, action) => {
      //   // console.log("updated:", action.payload);
      // })

      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.isLiked = action.payload.result.isLiked;
          post.likeCount = action.payload.result.isLiked
            ? post.likeCount + 1
            : post.likeCount - 1;
        }
      })
      // ===== Fetch Posts by User =====
      .addCase(fetchPostByUser.pending, (state) => {
        state.status = "loading"; // Đặt trạng thái thành loading
      })
      .addCase(fetchPostByUser.fulfilled, (state, action) => {
        state.status = "succeeded"; // Đặt trạng thái thành succeeded
        console.log("fetch posts by user:", action.payload);
        state.posts = action.payload; // Gán danh sách bài viết từ API
      })
      .addCase(fetchPostByUser.rejected, (state, action) => {
        state.status = "failed"; // Đặt trạng thái thành failed
        state.error = action.payload; // Lưu lỗi nếu có
      })

      // ===== Fetch Shared Posts by User =====
      .addCase(fetchSharedPostByUser.pending, (state) => {
        state.status = "loading"; // Đặt trạng thái thành loading
      })
      .addCase(fetchSharedPostByUser.fulfilled, (state, action) => {
        state.status = "succeeded"; // Đặt trạng thái thành succeeded
        console.log("Fetched shared posts:", action.payload);
        state.posts = action.payload.posts; // Gán danh sách bài viết từ API
      })
      .addCase(fetchSharedPostByUser.rejected, (state, action) => {
        state.status = "failed"; // Đặt trạng thái thành failed
        state.error = action.payload; // Lưu lỗi nếu có
      })
      // ===== Get User by ID =====
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading"; // Đặt trạng thái thành loading
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded"; // Đặt trạng thái thành succeeded
        state.user = action.payload; // Gán thông tin người dùng từ API
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed"; // Đặt trạng thái thành failed
        state.error = action.payload; // Lưu lỗi nếu có
      })

      // follow user
      .addCase(followUser.pending, (state) => {
        state.status = "loading"; // Đặt trạng thái thành loading
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.status = "succeeded"; // Đặt trạng thái thành succeeded
        state.user.isFollowedByCurrentUser = action.payload?.isFollowing;
        // state.user = action.payload; // Cập nhật thông tin người dùng từ API
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = "failed"; // Đặt trạng thái thành failed
        state.error = action.payload; // Lưu lỗi nếu có
      })

      // unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.status = "loading"; // Đặt trạng thái thành loading
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.status = "succeeded"; // Đặt trạng thái thành succeeded
        state.user.isFollowedByCurrentUser = action.payload?.isFollowing;
        // state.user = action.payload; // Cập nhật thông tin người dùng từ API
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.status = "failed"; // Đặt trạng thái thành failed
        state.error = action.payload; // Lưu lỗi nếu có
      });
  },
});

export const { setStatus } = profileSlice.actions;
export default profileSlice.reducer;
