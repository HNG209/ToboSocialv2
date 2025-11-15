import axios from "../axios/axios.customize";

const API_PREFIX = "/v1/api/posts";

const fetchPostDetailAPI = (postId) => {
  const URL_BACKEND = `${API_PREFIX}/${postId}`;
  return axios.get(URL_BACKEND);
};

const fetchPostAuthorAPI = (postId) => {
  const URL_BACKEND = `${API_PREFIX}/${postId}/author`;
  return axios.get(URL_BACKEND);
};

const fetchPostCommentsAPI = (postId, page = 1, limit = 10) => {
  const URL_BACKEND = `${API_PREFIX}/${postId}/comments?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const createPostAPI = async (postData) => {
  try {
    const response = await axios.post(API_PREFIX, postData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create post");
  }
};

const updatePostAPI = async (postId, postData) => {
  try {
    const URL_BACKEND = `${API_PREFIX}/${postId}`;
    const response = await axios.patch(URL_BACKEND, postData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update post");
  }
};

const deletePostAPI = (postId) => {
  const URL_BACKEND = `${API_PREFIX}/${postId}`;
  return axios.delete(URL_BACKEND);
};

export {
  fetchPostAuthorAPI,
  fetchPostCommentsAPI,
  fetchPostDetailAPI,
  deletePostAPI,
  createPostAPI,
  updatePostAPI,
};
