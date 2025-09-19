import {
  NotificationData,
  NotificationInformation,
} from "components/notification/notification";
import { createContext, useState } from "react";
import { v4 } from "uuid";

interface NotificationInitialProps {
  addNotification: (notification: NotificationInformation) => void;
  removeNotification: (id: string) => void;
  notifications: NotificationData[];
}

export const NotificationContext = createContext<NotificationInitialProps>({
  addNotification: () => {},
  removeNotification: () => {},
  notifications: [],
});

export default function NotificationProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  function addNotification(notification: NotificationInformation) {
    // each notification has a default duration of 5s
    const duration = 5000;
    if (!notification.type || !notification.message) {
      const e = `a <Notification/> must have a 'type' = ${notification.type} and a 'message' = ${notification.message} props`;
      throw new Error(e);
    }
    const newNotification = {
      ...notification,
      id: v4(),
      duration: notification.duration ?? duration,
    };
    setNotifications([...notifications, newNotification]);
  }

  // removes a notification based on the id of the notification
  function removeNotification(id: string) {
    setNotifications(
      notifications.filter((notification) => notification.id != id)
    );
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
