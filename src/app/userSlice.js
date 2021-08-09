import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "api/user";
import jwt from "jsonwebtoken";

const initialState = {
  token: null,
  error: "",
  user: null,
  loading: false,
};

export const userLogin = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const { message, accessToken } = await userApi.login(data);
      const { userId } = await jwt.verify(
        accessToken,
        process.env.REACT_APP_JWT_KEY
      );
      await dispatch(getMe(userId));
      return fulfillWithValue({ message, accessToken });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getMe = createAsyncThunk(
  "user/getMe",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const user = await userApi.get(id);
      return fulfillWithValue(user);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (user, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await userApi.create(user);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ _id, user }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const data = await userApi.update(_id, user);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut: (state) => {
      state.token = "";
      state.user = "";
      state.error = "";
    },
  },
  extraReducers: {
    // handle employee login
    [userLogin.pending]: (state) => {
      state.loading = true;
    },
    [userLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [userLogin.fulfilled]: (state, action) => {
      const { accessToken } = action.payload;
      state.loading = false;
      state.token = accessToken;
      state.error = "";
    },

    // handle fetch employees
    [getMe.pending]: (state) => {
      state.loading = true;
    },
    [getMe.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getMe.fulfilled]: (state, action) => {
      const { user } = action.payload;
      state.loading = false;
      state.user = user;
      state.error = "";
    },

    // handle create new employee
    [createUser.pending]: (state) => {
      state.loading = true;
    },
    [createUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [createUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = "";
    },

    // handle update employee
    [updateUser.pending]: (state) => {
      state.loading = true;
    },
    [updateUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [updateUser.fulfilled]: (state, action) => {
      const { userUpdated } = action.payload;
      state.loading = false;
      state.user = userUpdated;
      state.error = "";
    },
  },
});

const { reducer, actions } = userSlice;
export const { logOut } = actions;
export default reducer;
