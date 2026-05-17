import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import goalReducer from './slices/goalSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    notifications: notificationReducer,
  },
});
