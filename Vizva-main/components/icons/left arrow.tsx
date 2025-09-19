import styled from "@emotion/styled";
import { StyledSvg } from "./wrapper";

interface Props {
  className?: string;
}

export default function LeftArrow(props: Props) {
  const { className } = props;
  return (
    <StyledSvg
      className={`stroke-icon ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 59 33"
      stroke="#fff"
    >
      <path
        stroke="inherit"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M20.03 1L2 16.51l18.03 15.52M2 16.51h56.53"
      ></path>
    </StyledSvg>
  );
}
