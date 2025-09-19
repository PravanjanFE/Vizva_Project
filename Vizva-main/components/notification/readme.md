## this docs illustrates how to send notifications

notifications are of two types for now

- success notification
- error notification

each notification accepts the following props

- duration: how long the message will be displayed on screen default is 2000ms
- title: a title of the message
- message: a detailed description of the notification

### How to send a notification

    import { useAppDispatch } from "redux/hook";
    import { addNotification } from "redux/slice/notificationSlice";

    const dispatch = useAppDispatch();
    dispatch(addNotification({type:"error", message:"this error occured"}))
