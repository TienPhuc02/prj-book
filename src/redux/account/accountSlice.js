import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: "",
  },
};
export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    doLogoutAction: (state) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
      };
    },
    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    doUploadAvatarAccountAction: (state, action) => {
      // console.log(action.payload);
      state.user.avatar = action.payload;
    },
    doUpdateAccountAction: (state, action) => {
      state.user.fullName = action.payload.fullName;
      state.user.phone = action.payload.phone;
      state.user.avatar = action.payload.avatar;
    },
  },
});

export const {
  doLoginAction,
  doGetAccountAction,
  doLogoutAction,
  doUploadAvatarAccountAction,
  doUpdateAccountAction,
} = accountSlice.actions;

export default accountSlice.reducer;
