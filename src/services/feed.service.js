import axios from "../axios/axios.customize";

const fetchUserFeedAPI = (cursor, limit) => {
  const URL_BACKEND = `/v1/api/users/me/feed?cursor=${
    cursor || ""
  }&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

export { fetchUserFeedAPI };
