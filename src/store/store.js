import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth.slice";
import profileReducer from "../redux/profile.slice";
import commentReducer from "../redux/comment.slice";
import postReducer from "../redux/post.slice";
import notificationReducer from "../redux/notification.slice";

export const store = configureStore({
  reducer: {
    post: postReducer,
    auth: authReducer,
    profile: profileReducer,
    comment: commentReducer,
    notification: notificationReducer,
  },
});
