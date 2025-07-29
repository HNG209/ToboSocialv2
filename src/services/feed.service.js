import axios from "../axios/axios.customize";

const fetchUserFeedAPI = (page = 1, limit = 10) => {
  const URL_BACKEND = `/v1/api/user/profile/posts?page=${page}&limit=${limit}`; // TODO: change endpoint
  return axios.get(URL_BACKEND);
};

export { fetchUserFeedAPI };
