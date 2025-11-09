import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type NotificationState = {
   count: number;
};

const initialState: NotificationState = {
   count: 0,
};

const notificationSlice = createSlice({
   name: "notifications",
   initialState,
   reducers: {
      incrementNotificationCount: (state) => {
         state.count += 1;
      },
      clearNotificationCount: (state) => {
         state.count = 0;
      },
   },
});

export const { incrementNotificationCount, clearNotificationCount } = notificationSlice.actions;
export default notificationSlice.reducer;
export const selectCurrentNotificationCount = (state: RootState) => state.notifications.count;
