import styled from "@emotion/styled";
import Button from "components/button";
import { trendingArtists } from "entities/trendingArtists";
import Image, { StaticImageData } from "next/image";
import { breakpoint } from "public/breakpoint";

interface Props {
  data: {
    username: string;
    profilePic: {
      _url: StaticImageData;
    };
    time: string;
  };
}
function Profile(props: Props) {
  const { username, profilePic, time } = props.data;
  return (
    <StyledProfile>
      <div className="image-container">
        <Image src={profilePic._url} alt="user picture" />
      </div>
      <p className="username">
        @{username}
        <span> wants to collaborate</span>
      </p>
      <p className="time">35 minutes ago</p>
    </StyledProfile>
  );
}

export default function Requests() {
  return (
    <StyledDiv className="scrollbar">
      {trendingArtists.map((artist, index) => (
        <div className="content" key={index}>
          <Profile data={artist} />
          <div className="buttons-container">
            <Button variant="outline" text="Reject" size="sm" />
            <Button text="Accept" size="sm" />
          </div>
        </div>
      ))}
    </StyledDiv>
  );
}

const StyledProfile = styled.div`
  display: grid;
  grid-template-areas: "image username" "image time";
  grid-template-columns: max-content 1fr;
  align-items: center;
  grid-column-gap: 1rem;

  .image-container {
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    grid-area: image;
    width: 70px;
    height: 70px;
  }
  .username {
    grid-area: username;
    align-self: end;
    font-weight: bold;
    line-height: calc(1.5 * 1rem);

    & > span {
      color: ${(props) => props.theme.gray500};
      font-weight: initial;
    }
  }
  .time {
    color: ${(props) => props.theme.gray1};
    grid-area: time;
    align-self: start;
    font-size: 0.8rem;
    line-height: calc(1.2 * 1rem);
  }
`;

const StyledDiv = styled.div`
  height: 100%;
  max-height: calc(100vh - 74px - 4rem - 41px - 20px);
  overflow-y: scroll;
  display: grid;
  grid-row-gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;

  .content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr max-content;

    .buttons-container {
      height: max-content;
      align-self: start;
      display: grid;
      grid-column-gap: 1rem;
      grid-row-gap: 1rem;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr fit-content;
      margin-left: calc(70px + 1rem); // this is based on the width of the image
    }
  }

  ${breakpoint("sm")} {
    .content {
      grid-template-columns: 1fr max-content;
      grid-template-rows: max-content;
    }
    .buttons-container {
      align-self: center !important;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      margin-left: 0px !important;
    }
  }
`;
