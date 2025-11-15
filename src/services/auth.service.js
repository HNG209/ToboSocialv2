import axios from "../axios/axios.customize";

const API_PREFIX = "/v1/api/auth";

// Đăng nhập
const loginAPI = async (username, password) => {
  const URL_BACKEND = `${API_PREFIX}/login`;
  return axios.post(URL_BACKEND, { username, password });
};

// Đăng ký
const registerAPI = async (username, email, password, fullName) => {
  const URL_BACKEND = `${API_PREFIX}/register`;
  return axios.post(URL_BACKEND, { username, email, password, fullName });
};

// Đăng xuất
const logoutAPI = () => {
  const URL_BACKEND = `${API_PREFIX}/logout`;
  return axios.post(URL_BACKEND);
};

// Quên mật khẩu
const forgotPasswordAPI = (email) => {
  const URL_BACKEND = `${API_PREFIX}/forgot-password`;
  return axios.post(URL_BACKEND, { email });
};

const updateUserPasswordAPI = async (data) => {
  const URL_BACKEND = `${API_PREFIX}/password`;
  return axios.put(URL_BACKEND, data);
};

export {
  loginAPI,
  registerAPI,
  logoutAPI,
  forgotPasswordAPI,
  updateUserPasswordAPI,
};
