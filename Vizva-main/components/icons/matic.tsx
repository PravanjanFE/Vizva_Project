import styled from "@emotion/styled";
import { ThemeContext } from "context/themeContext";
import { useContext } from "react";

export default function MaticIcon({
  currency,
  className,
}: {
  currency: "MATIC" | "WMATIC";
  className?: string;
}) {
  return (
    <StyledMaticIcon dotted={currency === "WMATIC"} className={className}>
      <Icon />
    </StyledMaticIcon>
  );
}

function Icon() {
  const { mode } = useContext(ThemeContext);

  if (mode === "light") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="18"
        fill="none"
        viewBox="0 0 22 18"
      >
        <path
          fill="#575D69"
          d="M11.02 8.575L0 2.227v12.679l3.637 2.169.067-8.5 7.316 4.296V8.575z"
        ></path>
        <path
          fill="#A6A9B0"
          d="M3.637 17.074l3.704-2.137V10.71L3.704 8.574l-.067 8.5z"
        ></path>
        <path
          fill="#071023"
          d="M11.02 8.576l3.594-2.077L3.594.15 0 2.227l11.02 6.349z"
        ></path>
        <path
          fill="#A6A9B0"
          d="M14.615 6.498v4.184l-3.595 2.19V8.574l3.595-2.077z"
        ></path>
        <path
          fill="#575D69"
          d="M14.614 2.227v12.688l3.704 2.16V4.363l-3.704-2.136z"
        ></path>
        <path
          fill="#A6A9B0"
          d="M18.318 4.363L22 2.227V14.9l-3.682 2.174V4.363z"
        ></path>
        <path
          fill="#071023"
          d="M14.614 2.226L18.46 0 22 2.226l-3.682 2.137-3.704-2.137z"
        ></path>
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="18"
        fill="none"
        viewBox="0 0 22 18"
      >
        <path
          fill="#5C6166"
          d="M11.02 8.575L0 2.226v12.68l3.637 2.169.067-8.5 7.316 4.296V8.575z"
        ></path>
        <path
          fill="#C6C6C6"
          d="M3.637 17.075l3.704-2.137v-4.23L3.704 8.576l-.067 8.5z"
        ></path>
        <path
          fill="#fff"
          d="M11.02 8.575l3.594-2.077L3.594.149 0 2.226l11.02 6.349z"
        ></path>
        <path
          fill="#C6C6C6"
          d="M14.614 6.498v4.184L11.02 12.87V8.575l3.595-2.077z"
        ></path>
        <path
          fill="#5C6166"
          d="M14.614 2.226v12.69l3.704 2.159V4.363l-3.704-2.137z"
        ></path>
        <path
          fill="#C6C6C6"
          d="M18.318 4.363L22 2.226V14.9l-3.682 2.175V4.363z"
        ></path>
        <path
          fill="#fff"
          d="M14.614 2.226L18.46 0 22 2.226l-3.682 2.137-3.704-2.137z"
        ></path>
      </svg>
    );
  }
}

const StyledMaticIcon = styled.div<{ dotted: boolean }>`
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.gray1};
  border-style: ${(props) => props.dotted && "dashed"};
`;
