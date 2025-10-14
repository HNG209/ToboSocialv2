import axios from "../axios/axios.customize";

const sharePostAPI = (postId, caption) => {
  const URL_BACKEND = `/v1/api/shares`;
  return axios.post(URL_BACKEND, { postId, caption });
};

const fetchSharedPostByUserAPI = (userId, page = 1, limit = 10) => {
  const URL_BACKEND = `/v1/api/shares/users/${userId}?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const fetchSharedPostByPostAPI = (postId, page = 1, limit = 10) => {
  const URL_BACKEND = `/v1/api/shares/posts/${postId}?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const fetchProfileSharedPosts = (page = 1, limit = 10) => {
  const URL_BACKEND = `/v1/api/shares/profile/posts?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

export {
  sharePostAPI,
  fetchSharedPostByUserAPI,
  fetchSharedPostByPostAPI,
  fetchProfileSharedPosts,
};
