import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";
import Cookies from "js-cookie";

const initialState = {
  checkoutUrl: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Async thunk to call payment creation
export const createCheckoutSession = createAsyncThunk(
  "payment/createCheckout",
  async (checkoutData, thunkAPI) => {
    try {
      const token = Cookies.get("token");
      return await paymentService.createCheckoutSession(checkoutData, token);
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.checkoutUrl = action.payload.url;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;