import styled from "@emotion/styled";
import ErrorNotification from "./error";
import { NotificationMetaData, NotificationData } from "./notification";
import SuccessNotification from "./success";
import { useAppDispatch, useAppSelector } from "redux/hook";
import { removeNotification } from "redux/slice/notificationSlice";

export default function Notification() {
  const dispatch = useAppDispatch();
  const {notifications} = useAppSelector((state) => state.notification);

  function remove({ id, duration }: NotificationData) {
    const timer = setTimeout(function () {
      dispatch(removeNotification(id));
      clearInterval(timer);
    }, duration as number);
  }

  function renderer(notification: NotificationData) {
    const { type, id } = notification;
    switch (type) {
      case "error":
        return (
          <ErrorNotification
            key={id}
            notification={notification}
            remove={() => {
              remove(notification);
            }}
          />
        );
      case "success":
        return (
          <SuccessNotification
            key={id}
            notification={notification}
            remove={() => remove(notification)}
          />
        );
    }
  }

  return (
    <StyledDiv>
      {notifications.map((notification) => renderer(notification))}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: max-content;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  transition: 250ms ease-in-out;
  z-index: 100;
`;
