import axios from "../utils/axiosCustomize";

export const callAPICreateRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/auth/register", {
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
  return axios.get(`/api/v1/users?${query}`);
};
export const callCreateUsers = (data) => {
  return axios.post("/api/v1/users", data);
};
export const callBulkCreateUser = (data) => {
  return axios.post(`/api/v1/users/bulk-create`, data);
};
export const callUpdateUser = (data) => {
  return axios.put("/api/v1/users", data);
};
export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/users/${id}`);
};
export const callAllBooks = (query) => {
  return axios.get(`/api/v1/books?${query}`);
};
export const callBookCategory = () => {
  return axios.get("/api/v1/databases/category");
};
export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/files/upload",
    data: bodyFormData,
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>",
      "folder_type": "book",
    },
  });
};
export const callCreateNewBook = (data) => {
  return axios.post("/api/v1/books", data);
};
export const callUpdateBook = (id, data) => {
  return axios.put(`/api/v1/books/${id}`, data);
};
export const callDeleteBook = (id) => {
  return axios.delete(`/api/v1/books/${id}`);
};

export const callImageBook = (id) => {
  return axios.get(`/api/v1/books/${id}`);
};
export const callCreateAnBook = (data) => {
  return axios.post("/api/v1/orders", data);
};
export const callOrderHistory = () => {
  return axios.get("/api/v1/historys");
};
export const callUploadAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/files/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "folder_type": "avatar",
    },
  });
};
export const callChangePassword = (data) => {
  return axios.post("/api/v1/users/change-password", data);
};
export const callGetDashBoard = () => {
  return axios.get("/api/v1/databases/dashboard");
};
export const callAllOrder = (pagination) => {
  return axios.get(`/api/v1/orders?${pagination}`);
};
