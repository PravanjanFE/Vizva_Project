import { StyledSvg } from "./wrapper";

export default function DisabledIcon() {
  return (
    <StyledSvg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 22 22"
      className="stroke-icon"
      stroke="#000"
    >
      <circle
        cx="11"
        cy="11"
        r="10"
        stroke="inherit"
        strokeWidth="1.5"
      ></circle>
      <path
        stroke="inherit"
        strokeWidth="1.5"
        d="M17.629 4.371L4.37 17.63"
      ></path>
    </StyledSvg>
  );
}
