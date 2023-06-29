import axios from "../utils/axiosCustomize";

export const callAPICreateRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callAPICreateLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", {
    username,
    password,
  });
};
export const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account");
};

export const callLogOut = () => {
  return axios.post("/api/v1/auth/logout");
};
export const callAllUsers = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};
export const callCreateUsers = (data) => {
  return axios.post("/api/v1/user", data);
};
export const callBulkCreateUser = (data) => {
  return axios.post(`/api/v1/user/bulk-create`, data);
};
export const callUpdateUser = (data) => {
  return axios.put("/api/v1/user", data);
};
export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
};
export const callAllBooks = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};
export const callBookCategory = () => {
  return axios.get("/api/v1/database/category");
};
export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};
export const callCreateNewBook = (data) => {
  return axios.post("/api/v1/book", data);
};
export const callUpdateBook = (id, data) => {
  return axios.put(`/api/v1/book/${id}`, data);
};
export const callDeleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

export const callImageBook = (id) => {
  return axios.get(`/api/v1/book/${id}`);
};
export const callCreateAnBook = (data) => {
  return axios.post("/api/v1/order", data);
};
export const callOrderHistory = () => {
  return axios.get("/api/v1/history");
};
export const callUploadAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};
export const callChangePassword = (data) => {
  return axios.post("/api/v1/user/change-password", data);
};
export const callGetDashBoard = () => {
  return axios.get("/api/v1/database/dashboard");
};
export const callAllOrder = (pagination) => {
  return axios.get(`/api/v1/order?${pagination}`);
};
