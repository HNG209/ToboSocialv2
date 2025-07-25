import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCommentAPI,
  deleteCommentAPI,
  fetchPostCommentsAPI,
  updateCommentAPI,
} from "../services/comment.service";

export const fetchPostComments = createAsyncThunk(
  "comment/fetchPostComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetchPostCommentsAPI(postId);
      return { postId, comments: response }; //payload
    } catch (error) {
      console.error("Error in fetchComments:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const response = await createCommentAPI(postId, text);
      return response; //payload
    } catch (error) {
      console.error("Error in createComment:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async (comment, { rejectWithValue }) => {
    try {
      const response = await updateCommentAPI(comment);
      return response; //payload
    } catch (error) {
      console.error("Error in updateComment:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const rs = await deleteCommentAPI(commentId);

      return { rs, commentId };
    } catch (error) {
      console.error("Error in deleteComment:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

//store the comments context of current selected post
const commentSlice = createSlice({
  name: "comment",
  initialState: {
    postId: null,
    comments: [],
    newComments: null,
    status: "loading",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.postId = action.payload.postId;
        state.comments = action.payload.comments;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      //Create comment
      .addCase(createComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newComments = action.payload;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateComment.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteComment.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
