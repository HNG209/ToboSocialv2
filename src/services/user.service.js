import axios from "../axios/axios.customize";

const getUserProfile = () => {
  const URL_BACKEND = `/v1/api/user/profile`;
  return axios.get(URL_BACKEND);
};

// API theo dõi người dùng
const followUserAPI = (targetUserId, currentUserId) => {
  const URL = `/v1/api/users/${targetUserId}/follow`;
  return axios
    .post(URL, { userId: currentUserId })
    .then((response) => {
      // Trả về toàn bộ response từ API (bao gồm message và user)
      return response;
    })
    .catch((error) => {
      throw error; // Ném lỗi để Redux Toolkit xử lý
    });
};

// API bỏ theo dõi người dùng
const unfollowUserAPI = (targetUserId, currentUserId) => {
  const URL = `/v1/api/users/${targetUserId}/unfollow`;
  return axios
    .post(URL, { userId: currentUserId })
    .then((response) => {
      // Trả về toàn bộ response từ API (bao gồm message và user)
      return response;
    })
    .catch((error) => {
      throw error; // Ném lỗi để Redux Toolkit xử lý
    });
};

export { followUserAPI, unfollowUserAPI, getUserProfile };
