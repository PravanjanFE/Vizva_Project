import styled from "@emotion/styled";
import Image from "next/image";
import { Friend } from "../chats";

interface Props {
  data: Friend;
  onClick: () => void;
}

export default function ChatBlock({ data, onClick }: Props) {
  const { id, image, username, message } = data;
  return (
    <StyledChatBlock $read={message.seen} onClick={onClick}>
      <div>
        <div className="image-container">
          <Image src={image} layout="fill" objectFit="cover" quality={75} sizes='200px' />
        </div>
        <div>
          <h3>{username}</h3>
          <p>
            {id === 0 ? "You" : message.sender}: {message.message}
          </p>
        </div>
      </div>
      <p>12 Mins</p>
    </StyledChatBlock>
  );
}

const StyledChatBlock = styled.div<{ $read: boolean }>`
  cursor: pointer;
  background-color: ${(props) =>
    props.$read
      ? props.theme.mode === "dark"
        ? props.theme.gray900
        : props.theme.gray300
      : "transparent"};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  & > div {
    display: grid;
    grid-template-columns: 50px 1fr;
    column-gap: 10px;
    row-gap: 14px;
  }
  .image-container {
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  p {
    color: ${(props) =>
      props.theme.mode === "dark" ? props.theme.gray500 : props.theme.gray600};
  }
`;
