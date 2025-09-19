import styled from "@emotion/styled";
import { NotificationProps } from "./notification";

export default function ErrorNotification({
  notification,
  remove,
}: NotificationProps) {
  const { title, message } = notification;
  return (
    // @ts-ignore
    <StyledDiv onLoad={remove()}>
      <div>
        {title && <h4>{title}</h4>}
        <p>{message}</p>
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  background-color: ${(props) =>
    props.theme.mode == "light" ? "#ffe6e6" : "#ffbbbb"};
  color: ${(props) => (props.theme.mode == "light" ? "#c00000" : "#c00000")};
  border-left: 5px solid #ff0000;
  border-radius: 5px;
  /* max-height: 100px; */
  width: 300px;
  padding: 20px;
  svg {
    stroke: #ff0000;
  }
  h4 {
    color: #000000;
    font-weight: 500;
    line-height: 1em;
    padding-bottom: 10px;
  }
  p {
    color: #000000;
    /* font-size: 0.95rem; */
    line-height: 1.2em;
    text-transform: lowercase;
    letter-spacing: 0.05em;
    font-weight: 400;
  }
`;
