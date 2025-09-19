import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";

export default function Theme({ children }: { children: JSX.Element }) {
  return (
    <StyledDiv>
      <div>{children}</div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  min-height: calc(100vh - 74px);
  height: 100%;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.primary};

  & > div {
    padding: 0 var(--padding-sm);
    max-width: 2500px;
    margin: 0 auto;
  }
`;
