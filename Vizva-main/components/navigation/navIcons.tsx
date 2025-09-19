import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";

interface NavIconProps {
  icon: JSX.Element;
  className?: string;
  onClick?: () => void;
  href?: string;
  counter?: number;
  ariaLabel: string;
}

export default function NavIcon(props: NavIconProps) {
  const { icon, onClick, className, href, counter } = props;
  const Icon = icon;
  if (href) {
    return (
      <StyledAnchor
        className={className}
        onClick={onClick}
        href={href}
        aria-label={props.ariaLabel}
      >
        {Icon}
        {(counter ?? 0) > 0 && (
          <div
            className="counter"
            data-pill={(counter ?? 0) > 9 ? "true" : undefined}
          >
            {(counter as number) > 99 ? "99+" : counter}
          </div>
        )}
      </StyledAnchor>
    );
  } else {
    return (
      <StyledButton className={className} onClick={onClick} aria-label={props.ariaLabel}>
        {Icon}
        {(counter ?? 0) > 0 && (
          <div
            className="counter"
            data-pill={(counter ?? 0) > 9 ? "true" : undefined}
          >
            {(counter as number) > 99 ? "99+" : counter}
          </div>
        )}
      </StyledButton>
    );
  }
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  cursor: pointer;
  background-color: transparent;
  width: 36px;
  height: 36px;
  border: 0;
  /* outline: 2px solid ${(props) => props.theme.primary}; */
  outline: 2px solid transparent;
  position: relative;

  .counter {
    min-width: 16px;
    min-height: 16px;
    padding: 2px 4px;
    font-size: 12px;
    background-color: ${(props) => props.theme.green};
    color: #000000;
    border-radius: 16px;
    position: absolute;
    top: -8px;
    right: 0px;
    transform: translateY(50%);
    display: flex;
    align-items: center;
    justify-content: center;

    &[data-pill="true"] {
      right: -8px;
    }
  }

  &:hover,
  &:focus {
    outline-color: transparent;

    svg {
      &.stroke-icon {
        stroke: ${(props) => props.theme.green} !important;
      }
      &.fill-icon {
        fill: ${(props) => props.theme.green} !important;
      }
    }
  }

  svg {
    width: 20px;
    height: 20px;
    max-width: 20px;
    max-height: 20px;
    &.stroke-icon {
      stroke: ${(props) => props.theme.primary} !important;
    }
    &.fill-icon {
      fill: ${(props) => props.theme.primary} !important;
    }
  }
  ${breakpoint("sm")} {
    width: 50px;
    height: 50px;
  }
  ${breakpoint("3xl")} {
    svg {
      width: 24px;
      height: 24px;
      max-width: 24px;
      max-height: 24px;
    }
  }
`;

const StyledAnchor = StyledButton.withComponent("a");
