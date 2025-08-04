import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPostAPI,
  deletePostAPI,
  fetchPostAuthorAPI,
  fetchPostCommentsAPI,
  fetchPostDetailAPI,
  updatePostAPI,
} from "../services/post.service";
import {
  fetchLikersAPI,
  likeAPI,
  likeStatusAPI,
  unlikeAPI,
} from "../services/like.service";
import {
  createCommentAPI,
  fetchRepliedCommentAPI,
} from "../services/comment.service";
import {
  deleteComment,
  fetchHighLightComments,
  fetchRepliedCommentById,
  updateComment,
} from "./comment.slice";
import { pushUnique } from "../utils/pushUnique";

export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, { rejectWithValue }) => {
    try {
      const result = await createPostAPI(data);
      return result;
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ postId, data }, { rejectWithValue }) => {
    try {
      const result = await updatePostAPI(postId, data);
      return result;
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostDetail = createAsyncThunk(
  "post/fetchPostDetail",
  async (postId, { rejectWithValue }) => {
    try {
      // fetch comments
      const commentsResponse = await fetchPostCommentsAPI(postId);
      // fetch post likers
      const likersResponse = await fetchLikersAPI(postId, "post");

      return { commentsResponse, likersResponse };
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostAuthor = createAsyncThunk(
  "post/fetchPostAuthor",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetchPostAuthorAPI(postId);

      return response;
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoreComments = createAsyncThunk(
  "post/fetchMoreComments",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentPage = state.selectedPost.page;
      const postId = state.selectedPost.post._id;
      const fetchMore = state.selectedPost.fetchMore;

      if (!fetchMore) return { commentsResponse: [], nextPage: currentPage };

      const nextPage = currentPage + 1;
      // fetch comments
      const commentsResponse = await fetchPostCommentsAPI(postId, nextPage);

      return { commentsResponse, nextPage };
    } catch (error) {
      console.error("Error in fetching comments:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPost = createAsyncThunk(
  "post/fetchPost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const postInProfile = state.profile.posts.find(
        (post) => post._id === postId
      );

      const postInFeed = state.feed.posts.find((post) => post._id === postId);

      // fetch post, don't need to call API if viewing profile(posts already in profile context, reuse it)
      const postResponse =
        postInProfile || postInFeed || (await fetchPostDetailAPI(postId));
      // TODO: fetchPostDetail return like status by current user

      return postResponse;
    } catch (error) {
      console.error("Error in fetching post:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRepliesComment = createAsyncThunk(
  "post/fetchRepliesComment",
  async (commentId, { getState, rejectWithValue }) => {
    try {
      // lấy replyPage từ state, nếu không có thì mặc định là 1
      const state = getState();
      const pagination = state.post.comments.find(
        (c) => c._id === commentId
      )?.pagination;
      if (pagination && !pagination.hasNextPage) {
        return { commentId, replies: [] }; // nếu không có bình luận trả lời thì trả về mảng rỗng
      }

      const response = await fetchRepliedCommentAPI(
        commentId,
        pagination ? pagination.page + 1 : 1
      ); // Lấy bình luận trả lời

      return { commentId, replies: response }; // Trả về commentId và danh sách bình luận trả lời
    } catch (error) {
      console.error("Error in fetching replies comment:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  "post/createComment",
  async (comment, { rejectWithValue }) => {
    try {
      const response = await createCommentAPI({
        ...comment,
      });

      return response;
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "post/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const rs = await likeStatusAPI(postId, "post");
      if (!rs.isLiked) {
        return { postId, result: await likeAPI(postId, "post") };
      }

      return { postId, result: await unlikeAPI(postId, "post") };
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "post/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const rs = await likeStatusAPI(commentId, "comment");

      if (!rs.isLiked) {
        return await {
          result: await likeAPI(commentId, "comment"),
          root: rs.rootCommentId ? rs.rootCommentId : null,
        };
      }

      return await {
        result: await unlikeAPI(commentId, "comment"),
        root: rs.rootCommentId ? rs.rootCommentId : null,
      };
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const postId = state.post.current._id;
      const rs = await deletePostAPI(postId);

      return { rs, postId };
    } catch (error) {
      console.error("Error in fetching post detail:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    author: null, // thông tin tác giả của bài viết
    current: {}, // chi tiết bài viết hiện tại
    comments: [], // danh sách bình luận của bài viết, đánh dấu đã like đối với người dùng hiện tại
    highlightComment: null, // comment được highlight, khi fetch đến trang có comment này thì merge lại
    likers: [], // danh sách những người like bài viết
    status: "idle", // Trạng thái tải dữ liệu
    page: 1, // trang bình luận
    fetchMore: true,
    isLoadingMoreComments: false,
    error: null, // Lỗi nếu có
  },
  reducers: {
    clearReplyComments: (state, action) => {
      // tìm kiếm bình luận gốc trong danh sách bình luận
      const commentIndex = state.comments.findIndex(
        (c) => c._id === action.payload
      );
      if (commentIndex !== -1) {
        state.comments[commentIndex].replies = []; // xóa bình luận trả lời của bình luận gốc
        state.comments[commentIndex].replyPage = 1; // reset lại trang bình luận trả lời
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchPostAuthor.fulfilled, (state, action) => {
        state.author = action.payload;
      })

      // ===== Fetch Posts by User =====
      .addCase(fetchPostDetail.pending, (state) => {
        state.comments = [];
        state.page = 1;
        state.status = "loading"; // Đặt trạng thái thành loading
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        const { commentsResponse, likersResponse } = action.payload;
        state.status = "succeeded";
        state.comments = pushUnique(state.comments, commentsResponse, "_id");
        state.highlightComment = null;
        state.likers = likersResponse.users;
        state.page = 1;
        state.fetchMore = true;
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.status = "failed"; // Đặt trạng thái thành failed
        state.error = action.payload; // Lưu lỗi nếu có
      })
      .addCase(fetchMoreComments.pending, (state) => {
        state.isLoadingMoreComments = true;
        state.status = "loading"; // Đặt trạng thái thành loading
      })

      // fetch more comments(page > 1)
      .addCase(fetchMoreComments.fulfilled, (state, action) => {
        const { commentsResponse, nextPage } = action.payload;

        if (commentsResponse.length === 0) {
          state.isLoadingMoreComments = false;
          state.fetchMore = false;
          state.status = "succeeded";
          return;
        }

        state.comments = pushUnique(state.comments, commentsResponse, "_id");
        state.page = nextPage;
        state.isLoadingMoreComments = false;
        state.status = "succeeded";
      })
      .addCase(fetchMoreComments.rejected, (state, action) => {
        state.status = "failed"; // Đặt trạng thái thành failed
        state.error = action.payload; // Lưu lỗi nếu có
      })

      // Fetch highlight comment
      .addCase(fetchHighLightComments.fulfilled, (state, action) => {
        state.highlightComment = action.payload;
        state.comments = pushUnique(state.comments, [action.payload], "_id");
      })

      .addCase(fetchRepliedCommentById.fulfilled, (state, action) => {
        const comment = action.payload;
        const rootIndex = state.comments.findIndex(
          (c) => c._id === comment.rootComment
        );

        if (rootIndex === -1) return;

        state.comments[rootIndex].replies = pushUnique(
          state.comments[rootIndex].replies,
          [comment],
          "_id",
          true // push lên đầu
        );
      })

      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        // nếu trường rootComment tồn tại thì đây là bình luận trả lời, cập nhật lại bình luận gốc
        if (action.payload.rootComment) {
          const rootCommentIndex = state.comments.findIndex(
            (c) => c._id === action.payload.rootComment
          );
          if (rootCommentIndex === -1) return;
          //cập nhật thêm trường replies để chứa bình luận trả lời
          if (!state.comments[rootCommentIndex].replies) {
            state.comments[rootCommentIndex].replies = [action.payload];
          } else {
            state.comments[rootCommentIndex].replies = [
              ...state.comments[rootCommentIndex].replies,
              action.payload,
            ];
          }
          state.comments[rootCommentIndex].countReply =
            (state.comments[rootCommentIndex].countReply || 0) + 1;

          return; // nếu là bình luận trả lời thì không cần thêm vào danh sách bình luận gốc
        }

        state.comments = [...state.comments, action.payload]; // nếu không có trường rootComment thì đây là bình luận gốc, thêm vào danh sách bình luận
        state.current.commentCount = (state.current.commentCount || 0) + 1; // tăng số lượng bình luận của bài viết

        state.error = null; // Reset error state
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchRepliesComment.pending, (state) => {
        state.status = "loading"; // Đặt trạng thái thành loading
      })

      // Fetch replies comment
      .addCase(fetchRepliesComment.fulfilled, (state, action) => {
        const { commentId, replies } = action.payload;

        const commentIndex = state.comments.findIndex(
          (c) => c._id === commentId
        );

        // nếu không tìm thấy bình luận thì không cần cập nhật
        if (commentIndex === -1) return;

        // cập nhật replies mà không bị trùng
        state.comments[commentIndex].replies = pushUnique(
          state.comments[commentIndex].replies || [],
          replies.comments,
          "_id"
        );

        // thêm trường pagination để quản lý phân trang của bình luận trả lời
        state.comments[commentIndex].pagination = replies.pagination;

        state.status = "succeeded";
      })

      // Toggle post like
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.current.isLiked = action.payload.result.isLiked;
        if (state.current) {
          state.current.likeCount = action.payload.result.isLiked
            ? state.current.likeCount + 1
            : state.current.likeCount - 1;
        }
      })

      // Toggle comment like (sẽ di chuyển qua comment slice)
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { result, root } = action.payload;

        // nếu có root
        if (root) {
          const rootCommentIndex = state.comments.findIndex(
            (c) => c._id === root
          );
          if (rootCommentIndex === -1) return;
          // nếu có bình luận trả lời
          if (!state.comments[rootCommentIndex].replies) return;
          // tìm id của bình luận trả lời qua trường result.targetId
          const replyIndex = state.comments[rootCommentIndex].replies.findIndex(
            (r) => r._id === result.targetId
          );
          // cập nhật trạng thái đã like của bình luận trả lời
          if (replyIndex !== -1) {
            state.comments[rootCommentIndex].replies[replyIndex].isLiked =
              result.isLiked;
          }
        } else {
          // nếu không có root, cập nhật trạng thái đã like của bình luận gốc
          const commentIndex = state.comments.findIndex(
            (c) => c._id === result.targetId
          );
          if (commentIndex !== -1) {
            state.comments[commentIndex].isLiked = result.isLiked;
          }
        }
      })

      // Delete comment (lắng nghe bên comment slice)
      .addCase(deleteComment.fulfilled, (state, action) => {
        const {
          commentId,
          rs: { root },
        } = action.payload;

        if (!root)
          // Không có root thì đây là comment gốc
          state.comments = state.comments.filter((c) => c._id !== commentId);
        else {
          // Nếu có root thì đây là comment trả lời
          const rootIndex = state.comments.findIndex((c) => c._id === root);

          if (rootIndex !== -1) {
            state.comments[rootIndex].replies = state.comments[
              rootIndex
            ].replies.filter((c) => c._id !== commentId);
          }
        }
      })

      // Update comment (lắng nghe bên comment slice)
      .addCase(updateComment.fulfilled, (state, action) => {
        const newComment = action.payload.comment;

        const index = state.comments.findIndex((c) => c._id === newComment.id);
        if (index === -1) return;

        state.comments[index].text = newComment.text;
      });
  },
});

export const { clearReplyComments } = postSlice.actions;
export default postSlice.reducer;
