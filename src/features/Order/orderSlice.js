import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderApi from "api/order";

const initialState = {
  order: [],
  error: "",
  loading: false,
  state: "",
  id: "",
  userId: "",
};

export const getOrderById = createAsyncThunk(
  "order/getOrder",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const order = await orderApi.get(userId);
      return fulfillWithValue(order);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await orderApi.create(order);
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/updateOrder",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await orderApi.delete(id);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    getOrderWithCart: (state, action) => {
      const { order, userId } = action.payload;
      state.order = order;
      state.state = "";
      state.userId = userId;
    },
  },

  // handle get order
  extraReducers: {
    [getOrderById.pending]: (state) => {
      state.loading = true;
    },
    [getOrderById.rejected]: (state, action) => {
      state.loading = false;
      state.order = [];
      state.userId = "";
      state.id = "";
      state.error = action.payload.message;
    },
    [getOrderById.fulfilled]: (state, action) => {
      const { order } = action.payload;
      state.loading = false;
      state.state = order.state;
      state.order = order.products;
      state.id = order._id;
      state.userId = order.user._id;
      state.error = "";
    },

    // handle create order
    [createOrder.pending]: (state) => {
      state.loading = true;
    },
    [createOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [createOrder.fulfilled]: (state, action) => {
      const { newOrder } = action.payload;
      state.loading = false;
      state.state = newOrder.state;
      state.id = newOrder._id;
      state.order = newOrder.products;
      state.error = "";
    },

    // handle delete order
    [deleteOrder.pending]: (state) => {
      state.loading = true;
    },
    [deleteOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [deleteOrder.fulfilled]: (state) => {
      state.loading = false;
      state.order = [];
      state.error = "";
      state.state = "";
      state.id = "";
      state.userId = "";
    },
  },
});

const { actions, reducer } = orderSlice;
export const { getOrderWithCart } = actions;
export default reducer;
