import styled from "@emotion/styled";
import { HtmlHTMLAttributes } from "react";

export default function MaxWidth({
  children,
  ...others
}: HtmlHTMLAttributes<HTMLDivElement>) {
  return <StyledDiv className="def" {...others}>{children}</StyledDiv>;
}

const StyledDiv = styled.div`
  max-width: var(--size-max);
  margin: 0 auto;
  padding: 0 var(--padding-6);
`;
