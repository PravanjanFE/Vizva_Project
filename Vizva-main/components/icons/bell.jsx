import styled from "@emotion/styled";

export default function BellIcon() {
  return (
    <StyledSvg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="27"
      fill="#fff"
      viewBox="0 0 22 27"
      className="fill-icon"
    >
      <path
        fill="inherit"
        d="M10.542.234c2.493.005 4.883 1.052 6.644 2.911 1.762 1.86 2.75 4.38 2.75 7.006v9.917H1.13V10.15c0-2.63.992-5.153 2.757-7.012C5.65 1.279 8.046.234 10.542.234z"
      ></path>
      <path
        fill="inherit"
        d="M20.27 19.8H.816c-.45 0-.816.383-.816.856s.365.856.816.856H20.27c.45 0 .816-.383.816-.856s-.365-.856-.816-.856zM10.537 26.42c.94 0 1.842-.394 2.507-1.094a3.84 3.84 0 001.04-2.642H6.995c0 .49.09.976.268 1.429.177.453.438.865.767 1.212s.72.623 1.15.81c.43.188.89.285 1.356.285z"
      ></path>
    </StyledSvg>
  );
}

const StyledSvg = styled.svg`
  fill: ${(props) => props.theme.secondary};
`;
