export interface NotificationInformation {
  title?: string;
  message: string;
  type: string;
  duration?: string | number;
}

export interface NotificationData
  extends NotificationMetaData,
    NotificationInformation {}

export interface NotificationMetaData {
  id: string;
}

export interface NotificationProps {
  notification: NotificationData;
  remove: () => void;
}
