import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../utils/api';

export const getNotifications =
  createAsyncThunk(
    'notifications/getAll',

    async (_, thunkAPI) => {

      try {

        const res = await api.get(
          '/api/notifications'
        );

        return res.data;

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

const initialState = {

  notifications: [],

  unreadCount: 0,

  isLoading: false,

  isError: false,

  message: ''
};

const notificationSlice = createSlice({

  name: 'notifications',

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(
        getNotifications.pending,
        (state) => {

          state.isLoading = true;
        }
      )

      .addCase(
        getNotifications.fulfilled,
        (state, action) => {

          state.isLoading = false;

          state.notifications =
            action.payload;

          state.unreadCount =
            action.payload.length;
        }
      )

      .addCase(
        getNotifications.rejected,
        (state, action) => {

          state.isLoading = false;

          state.isError = true;

          state.message = action.payload;
        }
      );
  }
});

export default notificationSlice.reducer;