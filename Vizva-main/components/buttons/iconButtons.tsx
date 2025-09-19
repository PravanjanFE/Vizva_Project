import styled from "@emotion/styled";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { spinner } from "entities/keyframes";

interface BaseProps {
  /** @description URL has more precedence over onClick */
  href?: string;
  /**
   * @default false
   * @description loading state of a button */
  loading?: boolean;
  /**
   * @default false
   * @description disabled state of a button */
  disabled?: boolean;
  /**
   * @description defines the size of the button [sm] */
  size?: "sm" | "lg"; //sm
  /**
   * @default false
   * @description makes the button fill all available space */
  block?: boolean;
  icon: JSX.Element;
  variant?: "stroke" | "fill";
}

interface ButtonProps
  extends BaseProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

interface AnchorProps
  extends BaseProps,
    AnchorHTMLAttributes<HTMLAnchorElement> {}

export default function IconButton(props: AnchorProps | ButtonProps) {
  if (props?.href) {
    return <AnchorButtton {...(props as AnchorProps)} />;
  }

  return <ButtonButton {...(props as ButtonProps)} />;
}

function AnchorButtton(props: AnchorProps) {
  const {
    icon: Icon,
    disabled = false,
    href,
    loading = false,
    size, //sm
    block = false,
    variant = "stroke",
  } = props;
  return (
    <StyledAnchor
      {...props}
      href={disabled || loading ? undefined : href}
      $loading={loading}
      $disabled={loading ? false : disabled ? disabled : false}
      $size={size}
      $block={block}
      $variant={variant}
    >
      <div className="loading"></div>
      {Icon}
    </StyledAnchor>
  );
}
function ButtonButton(props: ButtonProps) {
  const {
    icon: Icon,
    onClick,
    disabled = false,
    href,
    loading = false,
    size, //sm
    block = false,
    variant = "stroke",
  } = props;
  function click() {
    if (disabled || loading) {
      return undefined;
    } else {
      return onClick;
    }
  }
  return (
    <StyledButton
      {...props}
      onClick={click()}
      loading={undefined}
      $loading={loading}
      disabled={loading ? false : disabled ? disabled : false}
      $size={size}
      $block={block}
      $variant={variant}
    >
      <div className="loading"></div>
      {Icon}
    </StyledButton>
  );
}

const StyledButton = styled.button<{
  $block: boolean;
  $loading: boolean;
  $size?: "sm" | "lg";
  $disabled?: boolean;
  $variant?: "stroke" | "fill";
  loading?: boolean;
}>`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 100%;
  cursor: ${(props) =>
    props.disabled ? "not-allowed" : props.$loading ? "wait" : "pointer"};
  background-color: ${(props) => props.theme.gray4};
  outline: none;
  border: none;

  &:hover,
  &:focus {
    outline: 2px solid ${(props) => props.theme.green};
  }

  svg {
    stroke: ${(props) =>
      props.$variant === "stroke" ? props.theme.secondary : "none"};
    fill: ${(props) =>
      props.$variant === "fill" ? props.theme.secondary : "none"};
    width: ${(props) => {
      if (props.$size === "sm") {
        return "1rem";
      } else if (props.$size === "lg") {
        return "2rem";
      } else {
        return "1rem";
      }
    }};
    height: auto;
  }
`;
const StyledAnchor = StyledButton.withComponent("a");
