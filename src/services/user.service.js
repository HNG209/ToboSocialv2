import axios from "../axios/axios.customize";

const API_PREFIX = "v1/api/users";

const getMyProfile = () => {
  const URL_BACKEND = `${API_PREFIX}/me/profile`;
  return axios.get(URL_BACKEND);
};

const editProfileAPI = (data) => {
  const URL_BACKEND = `${API_PREFIX}/me/profile`;
  return axios.put(URL_BACKEND, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getUserByIdAPI = (userId) => {
  const URL_BACKEND = `${API_PREFIX}/${userId}`;
  return axios.get(URL_BACKEND);
};

const searchUsersAPI = (query, page = 1, limit = 10) => {
  const URL_BACKEND = `${API_PREFIX}?q=${encodeURIComponent(
    query
  )}&page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const followUserAPI = (targetUserId) => {
  const URL_BACKEND = `${API_PREFIX}/${targetUserId}/follow`;
  return axios.post(URL_BACKEND);
};

const unfollowUserAPI = (targetUserId) => {
  const URL_BACKEND = `${API_PREFIX}/${targetUserId}/follow`;
  return axios.delete(URL_BACKEND);
};

const fetchMyPostsAPI = (page = 1, limit = 10) => {
  const URL_BACKEND = `${API_PREFIX}/me/posts?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const fetchPostByUserAPI = (authorId, page = 1, limit = 10) => {
  const URL_BACKEND = `${API_PREFIX}/${authorId}/posts?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

export {
  fetchPostByUserAPI,
  fetchMyPostsAPI,
  followUserAPI,
  unfollowUserAPI,
  getMyProfile,
  searchUsersAPI,
  getUserByIdAPI,
  editProfileAPI,
};
