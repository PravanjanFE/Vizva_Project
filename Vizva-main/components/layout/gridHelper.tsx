import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";
import { CSSProperties } from "react";

interface GridHelperProps {
  children: JSX.Element[];
  className?: string;
  style?: CSSProperties;
}

export default function GridHelper(props: GridHelperProps) {
  const { children, className, style } = props;
  return (
    <StyledDiv className={className} style={style}>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  grid-row-gap: var(--padding-9);
  grid-column-gap: var(--padding-8);

  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
    /* & > div:nth-of-type(2n) {
      align-self: center;
      justify-self: end;
    } */
  }
  @media (min-width: 1000px) {
    /* unset from previous breakpoint */
    /* & > div:nth-of-type(2n) {
      align-self: center;
      justify-self: start;
    }

    & > div:nth-of-type(3n + 2) {
      align-self: center;
      justify-self: center;
    }
    & > div:nth-of-type(3n) {
      align-self: center;
      justify-self: end;
    } */
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (min-width: 1300px) {
    /* unset previous breakpoint
    & > div,
    & > div:nth-of-type(3n),
    & > div:nth-of-type(3n + 2) {
      align-self: center;
      justify-self: center;
    }
    apply style for this screen
    & > div:nth-of-type(4n) {
      justify-self: end;
    }
    & > div:nth-of-type(4n + 1) {
      justify-self: start;
    } */
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
