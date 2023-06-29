import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doBookAction: (state, action) => {
      let carts = state.cart;
      let item = action.payload;
      let isExistIndex = carts.findIndex((c) => c._id === item._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + item.quantity;
        if (
          carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity
        ) {
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      } else {
        carts.push({
          quantity: item.quantity,
          id: item._id,
          detail: item.detail,
        });
      }
      //update redux
      state.cart = carts;
    },
    doUpdateOrder: (state, action) => {
      let carts = state.cart;
      const item = action.payload;
      let isExistIndex = carts.findIndex((c) => c.id === item._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity = item.quantity;
        if (
          carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity
        ) {
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      } else {
        carts.push({
          quantity: item.quantity,
          id: item._id,
          detail: item.detail,
        });
      }
      //update redux
      state.cart = carts;
    },
    doDeleteItemCartAction: (state, action) => {
      state.cart = state.cart.filter((c) => c.id !== action.payload._id);
    },
    doPlaceOrderAction: (state, action) => {
      state.cart = [];
    },
  },
});

export const {
  doBookAction,
  doUpdateOrder,
  doDeleteItemCartAction,
  doPlaceOrderAction,
} = orderSlice.actions;

export default orderSlice.reducer;
