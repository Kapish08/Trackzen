import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    { id: 1, title: 'Goal Approved', message: 'Your API Performance goal has been approved.', type: 'success', time: '2 mins ago' },
    { id: 2, title: 'New Shared Goal', message: 'You have been assigned a new departmental KPI.', type: 'info', time: '1 hour ago' },
    { id: 3, title: 'Check-in Due', message: 'Quarterly check-in for Q2 is due in 3 days.', type: 'warning', time: '5 hours ago' },
  ],
  unreadCount: 3,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },
});

export const { addNotification, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
