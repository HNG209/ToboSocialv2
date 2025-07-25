import axios from "../axios/axios.customize";

const createCommentAPI = (comment) => {
  const URL_BACKEND = `/v1/api/comments`;
  return axios.post(URL_BACKEND, comment);
};

const updateCommentAPI = (comment) => {
  const URL_BACKEND = `/v1/api/comments`;
  return axios.patch(URL_BACKEND, { comment });
};

const deleteCommentAPI = (commentId) => {
  const URL_BACKEND = `/v1/api/comments/${commentId}`;
  return axios.delete(URL_BACKEND);
};

const fetchPostCommentsAPI = (postId) => {
  const URL_BACKEND = `v1/api/posts/${postId}/comments`;
  return axios.get(URL_BACKEND);
};

const fetchRepliedCommentAPI = (commentId, page = 1, limit = 2) => {
  const URL_BACKEND = `/v1/api/comments/${commentId}/replies?page=${page}&limit=${limit}`;
  return axios.post(URL_BACKEND);
};

export {
  createCommentAPI,
  deleteCommentAPI,
  updateCommentAPI,
  fetchPostCommentsAPI,
  fetchRepliedCommentAPI,
};
