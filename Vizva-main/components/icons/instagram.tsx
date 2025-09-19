import styled from "@emotion/styled";
import { StyledSvg } from "./wrapper";

export default function InstagramIcon() {
  return (
    <StyledInstagram
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="29"
      fill="#000"
      viewBox="0 0 29 29"
      className="fill-icon"
    >
      <path
        fill="inherit"
        d="M14.04 28.082c7.755 0 14.042-6.287 14.042-14.041C28.082 6.286 21.795 0 14.04 0 6.286 0 0 6.286 0 14.04c0 7.755 6.286 14.042 14.04 14.042z"
      ></path>
      <path
        className="path"
        fill="#fff"
        d="M18.612 8.47a1.008 1.008 0 100 2.016 1.008 1.008 0 000-2.015zM14.111 9.766a4.254 4.254 0 100 8.507 4.254 4.254 0 000-8.507zm0 6.975a2.721 2.721 0 110-5.443 2.721 2.721 0 010 5.443z"
      ></path>
      <path
        className="path"
        fill="#fff"
        d="M17.488 22.653h-6.894a5.196 5.196 0 01-5.186-5.186v-6.894a5.196 5.196 0 015.186-5.186h6.894a5.196 5.196 0 015.186 5.186v6.894a5.196 5.196 0 01-5.186 5.186zM10.594 7.03a3.563 3.563 0 00-3.558 3.558v6.88a3.563 3.563 0 003.558 3.557h6.894a3.564 3.564 0 003.558-3.558v-6.894a3.564 3.564 0 00-3.558-3.558l-6.894.015z"
      ></path>
    </StyledInstagram>
  );
}

const StyledInstagram = styled(StyledSvg)`
  path.path {
    fill: ${(props) => props.theme.onBackground};
  }
`;
