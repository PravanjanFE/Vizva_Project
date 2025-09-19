import styled from "@emotion/styled";
import { NotificationProps } from "./notification";

export default function SuccessNotification({
  notification,
  remove,
}: NotificationProps) {
  const { title, message } = notification;
  return (
    //@ts-ignore
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
    props.theme.mode == "light" ? "#e6ffe6" : "#bbffcf"};
  color: ${(props) => (props.theme.mode == "light" ? "#00c020" : "#00c020")};
  border-left: 5px solid #00ff00;
  border-radius: 5px;
  /* max-height: 100px; */
  width: 300px;
  padding: 20px;
  svg {
    stroke: #00ff00;
  }
  h4 {
    color: #000000;
    font-weight: 500;
    line-height: 1em;
    padding-bottom: 10px;
  }
  p {
    color: #000000;
    /* font-size: 0.825rem; */
    line-height: 1.2em;
    text-transform: lowercase;
    letter-spacing: 0.05em;
    font-weight: 400;
  }
`;
