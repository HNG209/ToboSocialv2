import axios from "../axios/axios.customize";

const getUserProfile = () => {
  const URL_BACKEND = `/v1/api/user/profile`;
  return axios.get(URL_BACKEND);
};

const getUserAPI = (userId) => {
  const URL_BACKEND = `/v1/api/users/${userId}`;
  return axios.get(URL_BACKEND);
};

const updateUserAPI = (data) => {
  const URL_BACKEND = `/v1/api/users`;
  return axios.put(URL_BACKEND, data);
};

const followUserAPI = (targetUserId) => {
  const URL_BACKEND = `/v1/api/follow/${targetUserId}`;
  return axios.post(URL_BACKEND);
};

const unfollowUserAPI = (targetUserId) => {
  const URL_BACKEND = `/v1/api/unfollow/${targetUserId}`;
  return axios.delete(URL_BACKEND);
};

const searchUsersAPI = (query) => {
  const URL = `/v1/api/search?q=${encodeURIComponent(query)}`;
  return axios.get(URL);
};

export {
  followUserAPI,
  unfollowUserAPI,
  updateUserAPI,
  getUserProfile,
  searchUsersAPI,
  getUserAPI,
};
