import styled from "@emotion/styled";
import { StyledSvg } from "./wrapper";

interface Props {
  className?: string;
}

export default function RightArrow(props: Props) {
  const { className } = props;
  return (
    <StyledSvg
      className={`stroke-icon ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 60 33"
      stroke="#fff"
    >
      <path
        stroke="inherit"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M39.46 1l18.03 15.51-18.03 15.52M57.49 16.51H.96"
      ></path>
    </StyledSvg>
  );
}