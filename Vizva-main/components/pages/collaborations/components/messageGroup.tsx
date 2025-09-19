import styled from "@emotion/styled";
import Image, { StaticImageData } from "next/image";

interface Props {
  username: string;
  image: StaticImageData;
  // msgs: string;
}
export default function MessageGroup({ username, image }: Props) {
  return (
    <StyledMessageGroup $username={username}>
      <div className="image-container">
        <Image src={image} layout="fill" objectFit="cover" quality={75} sizes='200px' />
      </div>
      <div className="msg-group-content">
        {/* !TODO this is how it will be rendered */}
        {/* {msgs.map((msg, index) => (
          <MessageBlock
            key={msg + index}
            username={username}
            message={msg}
          />
        ))} */}
        <MessageBlock
          username={username}
          message="Lorem ipsum dolor sit amet"
        />
        <MessageBlock
          username={username}
          message="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        />
        <MessageBlock
          username={username}
          message="Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero aliquam corrupti ratione harum exercitationem deleniti veritatis quam expedita adipisci atque!"
        />
      </div>
    </StyledMessageGroup>
  );
}

interface BlockProps {
  message: string;
  username: string;
}
function MessageBlock({ message, username }: BlockProps) {
  return <StyledMessageBlock $username={username}>{message}</StyledMessageBlock>;
}

const StyledMessageGroup = styled.div<{ $username: string }>`
  padding-top: 1rem;
  display: flex;
  flex-direction: ${(props) =>
    props.$username === "username" ? "row" : "row-reverse"};
  /* margin-left: auto; */
  div.image-container {
    background-color: gray;
    position: relative;
    overflow: hidden;
    border-radius: 50px;
    min-width: 50px;
    height: 50px;
    margin: ${(props) =>
      props.$username === "username" ? "0 10px 0 0" : "0 0 0 10px"};
  }
  div.msg-group-content {
    display: flex;
    flex-direction: column;
    align-items: ${(props) =>
      props.$username === "username" ? "start" : "end"};
    & > :not(last-child) {
      margin-bottom: 5px;
    }
  }
`;

const StyledMessageBlock = styled.p<{ $username: string }>`
  border-radius: 20px;
  max-width: 600px;
  background-color: ${(props) =>
    props.$username === "username" ? props.theme.gray300 : "white"};
  padding: 10px;
  font-size: 0.9rem;
  letter-spacing: 0.03em;
  line-height: calc(0.9rem * 1.5);
`;
