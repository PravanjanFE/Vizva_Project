import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  NotificationData,
  NotificationInformation,
} from "components/notification/notification";
import { v4 } from "uuid";

interface InitialState {
  notifications: NotificationData[];
}

// Define the initial state using that type
const initialState: InitialState = {
  notifications: [],
};

export const notification = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    
    addNotification(
      state,
      notification: PayloadAction<NotificationInformation>
    ) {
      // each notification has a default duration of 5s
      const duration = 5000;
      if (!notification.payload.type || !notification.payload.message) {
        const e = `a <Notification/> must have a 'type' = ${notification.payload.type} and a 'message' = ${notification.payload.message} props`;
        throw new Error(e);
      }
      const newNotification = {
        ...notification.payload,
        id: v4(),
        duration: notification.payload.duration ?? duration,
      };
      const v = [...state.notifications, newNotification];
      state.notifications = [...v];
    },

    // removes a notification based on the id of the notification
    removeNotification(state, id: PayloadAction<string>) {
      const newData = state.notifications.filter(
        (notification) => notification.id != id.payload
      );
      state.notifications = [...newData];
    },
  },
});

export const { addNotification, removeNotification } = notification.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.notification;

export default notification.reducer;
