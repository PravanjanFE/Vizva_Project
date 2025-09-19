import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";

interface HeaderProps {
  children: JSX.Element[];
  className?: string;
}

export default function Header(props: HeaderProps) {
  const { children, className } = props;
  return <StyledDiv className={className}>{children}</StyledDiv>;
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  h2 {
    font-weight: 500;
    align-self: start;
    text-transform: capitalize;
    line-height: 1em;
    font-size: var(--fontsizes-5);
  }

  @media (min-width: 620px) {
    flex-direction: row;
  }
  ${breakpoint("lg")} {
    h2 {
      font-size: var(--fontsizes-7);
    }
  }
`;
