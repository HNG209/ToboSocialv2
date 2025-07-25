import axios from "../axios/axios.customize";

const fetchLikersAPI = (postId, onModel) => {
  const URL_BACKEND = `/v1/api/likers/${postId}`;
  return axios.post(URL_BACKEND, { onModel });
};

const likeAPI = (postId, onModel) => {
  const URL_BACKEND = `/v1/api/like/${postId}`;
  return axios.post(URL_BACKEND, { onModel });
};

const unlikeAPI = (postId, onModel) => {
  const URL_BACKEND = `/v1/api/unlike/${postId}`;
  return axios.post(URL_BACKEND, { onModel });
};

const likeStatusAPI = (postId, onModel) => {
  const URL_BACKEND = `/v1/api/is-liked/${onModel}/${postId}`;
  return axios.get(URL_BACKEND);
};

const counLikeAPI = (postId, onModel) => {
  const URL_BACKEND = `/v1/api/like/count${postId}`;
  return axios.post(URL_BACKEND, { onModel });
};

export { fetchLikersAPI, likeAPI, unlikeAPI, likeStatusAPI, counLikeAPI };
