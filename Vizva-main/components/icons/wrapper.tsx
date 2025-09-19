import styled from "@emotion/styled";

export default function IconWrapper({ children }: { children: JSX.Element }) {
  return <>{children}</>;
}

export const StyledSvg = styled.svg`
  width: 1rem;
  height: 1rem;
  max-width: 1rem;
  max-height: 1rem;
  &.stroke-icon {
    stroke: ${(props) => props.theme.gray1};
  }
  &.fill-icon {
    fill: ${(props) => props.theme.gray1};
  }
`;
