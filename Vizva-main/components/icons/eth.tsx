import styled from "@emotion/styled";

export default function EthIcon({
  currency,
  className,
}: {
  currency: "MATIC" | "WMATIC";
  className?: string;
}) {
  return (
    <StyledEthIcon dotted={currency === "MATIC"} className={className}>
      <Icon />
    </StyledEthIcon>
  );
}

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="25"
      fill="none"
      viewBox="0 0 16 25"
    >
      <path
        fill="#343434"
        d="M7.542.479l.164.557v16.159l-.164.163-7.5-4.433L7.542.479z"
      ></path>
      <path fill="#8C8C8C" d="M7.543.479l7.5 12.446-7.5 4.433V.48z"></path>
      <path
        fill="#3C3C3B"
        d="M7.543 18.78l.093.112v5.756l-.093.27-7.505-10.57 7.505 4.431z"
      ></path>
      <path fill="#8C8C8C" d="M7.543 24.918v-6.139l7.5-4.431-7.5 10.57z"></path>
      <path fill="#141414" d="M7.542 17.359l-7.5-4.434 7.5-3.41v7.844z"></path>
      <path fill="#393939" d="M15.044 12.925l-7.5 4.434V9.516l7.5 3.41z"></path>
    </svg>
  );
}
const StyledEthIcon = styled.div<{ dotted: boolean }>`
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.gray1};
  border-style: ${(props) => props.dotted && "dashed"};
`;
