import axios from "../axios/axios.customize";

const fetchPostDetailAPI = (postId) => {
  const URL_BACKEND = `/v1/api/posts/${postId}`;
  return axios.get(URL_BACKEND);
};

const fetchPostByUserAPI = (authorId, page = 1, limit = 10) => {
  const URL_BACKEND = `/v1/api/user/${authorId}/posts?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const fetchProfilePosts = (page = 1, limit = 10) => {
  const URL_BACKEND = `/v1/api/user/profile/posts?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const fetchPostAuthorAPI = (postId) => {
  const URL_BACKEND = `v1/api/${postId}/author`;
  return axios.get(URL_BACKEND);
};

const fetchPostCommentsAPI = (postId, page = 1, limit = 10) => {
  //v2: có trả về trạng thái đã like bình luận của người dùng
  const URL_BACKEND = `v1/api/posts/${postId}/comments?page=${page}&limit=${limit}`;
  return axios.get(URL_BACKEND);
};

const createPostAPI = async (postData) => {
  try {
    const response = await axios.post("/v1/api/posts", postData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create post");
  }
};

const deletePostAPI = (postId) => {
  const URL_BACKEND = `/v1/api/posts/${postId}`;
  return axios.delete(URL_BACKEND);
};

export {
  fetchPostAuthorAPI,
  fetchProfilePosts,
  fetchPostByUserAPI,
  fetchPostCommentsAPI,
  fetchPostDetailAPI,
  deletePostAPI,
  createPostAPI,
};
