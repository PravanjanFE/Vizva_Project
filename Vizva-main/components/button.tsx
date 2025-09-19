import styled from "@emotion/styled";
import { spinner } from "entities/keyframes";
import Link from "next/link";
import { breakpoint } from "public/breakpoint";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

interface BaseProps {
  /** @description Button text */
  text: string;
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
  size?: "sm" | "xs"; //sm
  /**
   * @default filled
   * @description defines the type of button [filled | outline | text] */
  variant?: "filled" | "outline" | "text" | "icon";
  /**
   * @default false
   * @description makes the button fill all available space */
  block?: boolean;
}

interface ButtonProps
  extends BaseProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

interface AnchorProps
  extends BaseProps,
    AnchorHTMLAttributes<HTMLAnchorElement> {}

export default function Button(props: AnchorProps | ButtonProps) {
  if (props?.href) {
    return <AnchorButtton {...(props as AnchorProps)} />;
  }

  return <ButtonButton {...(props as ButtonProps)} />;
}

function AnchorButtton(props: AnchorProps) {
  const {
    text,
    disabled = false,
    href,
    loading = false,
    size, //sm
    variant = "filled", //outline or text
    block = false,
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
      {text}
    </StyledAnchor>
  );
}
function ButtonButton(props: ButtonProps) {
  const {
    onClick,
    text,
    disabled = false,
    href,
    loading = false,
    size, //sm
    variant = "filled", //outline or text
    block = false,
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
      {text}
    </StyledButton>
  );
}
const StyledButton = styled.button<{
  $variant: string;
  $block: boolean;
  $loading: boolean;
  $size?: string;
  $disabled?: boolean;
  loading?: boolean;
}>`
  background-color: ${(props) =>
    props.$variant === "filled"
      ? props.theme.green
      : props.$variant === "outline"
      ? "transparent"
      : "transparent"};
  border-radius: 50px;
  border: ${(props) =>
    props.$variant === "outline"
      ? props.disabled || props.$disabled
        ? `1px solid ${props.theme.gray2}`
        : `1px solid ${props.theme.green}`
      : "none"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.$block ? "100%" : "max-content")};
  min-width: 100px;
  text-align: center;
  height: auto;
  outline: none;
  line-height: calc(1.5 * 1rem);
  font-size: ${(props) =>
    props.$size === "xs"
      ? "var(--fontsizes-1)"
      : props.$size === "sm"
      ? "var(--fontsizes-1)"
      : "var(--fontsizes-2)"};
  cursor: ${(props) =>
    props.disabled || props.$disabled || props.$loading
      ? "default"
      : "pointer"};
  isolation: isolate;
  position: relative;
  overflow: hidden;
  padding: ${(props) =>
    props.$size === "xs"
      ? "0.75rem 1.5rem"
      : props.$size === "sm"
      ? "1rem 1.8rem"
      : "1.2rem 3rem"};
  transition: all 0.19s linear;
  color: ${(props) => {
    let color = "";
    if (props.$variant === "filled") {
      if (props.disabled || (props.disabled && props.theme.mode === "dark")) {
        color = props.theme.background;
      } else if (props.disabled) {
        color = props.theme.gray1;
      } else if (props.$loading) {
        color = "transparent";
      } else {
        color = props.theme.background;
      }
    } else {
      if (props.disabled) {
        color = props.theme.gray2;
      } else if (props.$loading) {
        color = "transparent";
      } else {
        color = props.theme.green;
      }
    }
    return color;
  }} !important;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")} !important;

  &::after {
    content: "";
    inset: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: rgba(0, 0, 0, 0.411);
    mix-blend-mode: overlay;
    opacity: 0;
  }
  .loading {
    position: absolute;
    background-color: transparent;
    width: 35px;
    height: 35px;
    left: 50%;
    top: 50%;
    border-radius: 50%;
    border: 3px solid rgba(133, 158, 133, 0.384);
    border-bottom: 3px solid
      ${(props) =>
        props.$variant === "filled"
          ? props.theme.background
          : props.theme.green};
    animation: ${spinner} 1.5s linear infinite;
    visibility: ${(props) => (props.$loading ? "visible" : "hidden")};
  }

  &:hover,
  &:focus {
    box-shadow: ${(props) =>
      props.$variant !== "filled"
        ? "none"
        : props.disabled ||
          props.$disabled ||
          props.theme.mode == "dark" ||
          props.$loading
        ? "none"
        : "0px 0px 10px 1px rgba(0, 255, 0, 0.15)"};
    &::after {
      opacity: ${(props) =>
        props.$variant !== "filled"
          ? "none"
          : props.disabled || props.$loading
          ? "0"
          : "1"};
    }
    background-color: ${(props) => {
      let color = "";
      if (props.$variant !== "filled" && !props.disabled && !props.$loading) {
        color = props.theme.green;
      }

      return color;
    }};
    color: ${(props) => {
      let color = "";
      if (props.$variant !== "filled" && !props.disabled && !props.$loading) {
        color = props.theme.background;
      }
      return color;
    }} !important;
  }

  /* padding: ${(props) =>
    props.$size === "sm" ? "1rem 1.5rem" : "1.2rem 3rem"}; */
  /* padding: 1rem 1.5rem; */
  ${breakpoint("lg")} {
    font-size: ${(props) =>
      props.$size ? "var(--fontsizes-2)" : "var(--fontsizes-3)"};
  }

  ${breakpoint("3xl")} {
    font-size: var(--fontsizes-3);
    padding: ${(props) => (props.$size ? "1rem 1.5rem" : "1.7rem 3rem")};
  }
`;
const StyledAnchor = StyledButton.withComponent("a");
