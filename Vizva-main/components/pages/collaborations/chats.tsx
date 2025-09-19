import styled from "@emotion/styled";
import Search from "components/form elements/search";
import { FiMoreHorizontal, FiSearch, FiSend } from "react-icons/fi";
import artist1 from "public/artists/artist 1.png";
import artist2 from "public/artists/artist 2.png";
import Image, { StaticImageData } from "next/image";
import MessageGroup from "./components/messageGroup";
import ChatBlock from "./components/chatBlock";
import { ChangeEvent, useState } from "react";

export interface Friend {
  id: number;
  username: string;
  image: StaticImageData;
  message: {
    sender: string;
    message: string;
    seen: boolean;
  };
}

interface Message {
  id: number;
  message: string;
  username: string;
}

export default function Chats() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      username: "osenemendia",
      image: artist1,
      message: {
        sender: "223",
        message: "how are you",
        seen: false,
      },
    },
    {
      id: 2,
      username: "wisdom",
      image: artist2,
      message: {
        sender: "2",
        message: "the NFT is selling well",
        seen: true,
      },
    },
    {
      id: 3,
      username: "fredrick",
      image: artist1,
      message: {
        sender: "23",
        message: "how are you",
        seen: false,
      },
    },
  ]);
  const [friend, setFriend] = useState(() => friends[0]);

  function updateFriend(data: Friend) {
    /**
     * id,
     * username,
     * profile image
     */
    setFriend(data);
    // set the seen status to true after the friend has been set
  }
  function updateMessage(data: Message) {
    const { message, id, username } = data;
    const newMsg = {
      id,
      message,
      username,
    };
  }

  return (
    <StyledDiv>
      <Friends updateFriend={updateFriend} friends={friends} />
      <Messages
        friend={friend}
        updateMessage={updateMessage}
        messages={messages}
      />
    </StyledDiv>
  );
}

interface Friends {
  friends: Friend[];
  updateFriend(p: Friend): void;
}

function Friends({ friends, updateFriend }: Friends) {
  return (
    <StyledChats>
      <div className="friends-heading">
        <h1>Chats</h1>
        <FiSearch size={20} />
      </div>
      <div className="friends-friends">
        {friends.map((friend: Friend, index: number) => (
          <ChatBlock
            data={friend}
            key={friend.id}
            onClick={() => updateFriend(friend)}
          />
        ))}
      </div>
    </StyledChats>
  );
}

interface MessagesProps {
  friend: Friend;
  updateMessage(p: Message): void;
  messages: Message[];
}

function Messages({ friend, updateMessage, messages }: MessagesProps) {
  const [message, setMessage] = useState("");
  function updateMsg(e: any) {
    setMessage(e?.target?.textContent ?? "");
    updateMessage({ id: 0, message, username: "" });
  }
  return (
    <StyledMessage>
      <div className="messages-heading">
        <div>
          <div className="image-container">
            <Image
              alt="user picture"
              src={friend.image}
              layout="fill"
              objectFit="cover"
              quality={75}
              sizes="200px"
            />
          </div>
          <h3>{friend.username}</h3>
        </div>
        <FiMoreHorizontal size={30} />
      </div>
      <div className="messages-messages">
        <div className="content">
          <MessageGroup image={artist1} username="username" />
          <MessageGroup image={artist1} username="ose" />
          <MessageGroup image={artist1} username="username" />
          <MessageGroup image={artist1} username="ose" />
        </div>

        <div className="input">
          {/* <TextInput placeholder="Write your message" padding={false} /> */}
          <div className="textarea">
            <div
              contentEditable={true}
              role="textbox"
              onKeyDown={(e) => updateMsg(e)}
            ></div>
          </div>
          <div className="send">
            <FiSend size={20} />
          </div>
        </div>
      </div>
    </StyledMessage>
  );
}

const StyledChats = styled.div`
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.gray1};

  .friends-heading {
    padding: 0 25px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* border-bottom: 1px solid ${(props) => props.theme.gray1}; */
  }
  .friends-friends {
    padding: 0 25px 0;
    overflow: auto;
    max-height: calc(100vh - 74px - 41px - 6rem - 41px);

    & > :not(first-child) {
      margin-top: 10px;
    }
  }
`;
const StyledMessage = styled.div`
  .messages-heading {
    padding: 0 25px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.gray1};

    & > div {
      display: grid;
      grid-template-columns: 50px 1fr;
      gap: 10px;
      align-items: center;
    }

    .image-container {
      position: relative;
      overflow: hidden;
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
  }
  .messages-messages {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    height: calc(100vh - 74px - 41px - 4rem - 60px - 2px);

    .content {
      padding: 0 25px 0;
      overflow-y: auto;
      overflow-x: hidden;
      flex-grow: 1;
      & > :not(first-child) {
        margin-top: 10px;
      }
    }

    .input {
      flex-grow: 0;
      padding: 5px 25px;
      display: flex;

      align-items: center;
      justify-content: center;

      .textarea {
        width: 90%;
        flex-grow: 1;
        border-radius: 25px;
        border: 1px solid gray;
        & > div {
          max-width: 95%;
          max-height: 86px;
          overflow-y: auto;
          overflow-x: hidden;
          white-space: pre-wrap;
          overflow-wrap: break-word;
          margin: 0 auto;
          outline: none;
          padding: 5px 0;
          background: transparent;
          border: none;
        }
      }

      .send {
        margin-left: 20px;
        display: grid;
        place-items: center;
        cursor: pointer;
      }
    }
  }
`;
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  height: 100%;
  /* max-width: calc(
    100vw - 3px - clamp(20px, 2vw + 1rem, 100px) -
      clamp(20px, 2vw + 1rem, 100px)
  ); */
  border-top: 1px solid ${(props) => props.theme.gray1};
  border-left: 1px solid ${(props) => props.theme.gray1};
  border-right: 1px solid ${(props) => props.theme.gray1};
  svg {
    cursor: pointer;
  }
`;
