import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { INFO_BAR_PROPS } from "./profile.type";

export default function InfoBar(props: INFO_BAR_PROPS) {
  const { address, myProfile, className, profile } = props;
  const [copyText, setCopyText] = useState("Copy");

  function onCopy() {
    setCopyText("Copied");
  }
  function onAfterCopy() {
    setCopyText("Copy");
  }
  return (
    <StyledInfoBar className={`${className} info-bar`}>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <button className="address" onBlur={onAfterCopy} title={copyText}>
          <div className="address__tooltip">{copyText}</div>
          {address && address.slice(0, 16)}...
          {address && address.slice(-4)}
        </button>
      </CopyToClipboard>
    </StyledInfoBar>
  );
}

const StyledInfoBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: max-content;
  margin: 0 auto 1rem auto;
  .address {
    background-color: ${(props) =>
      props.theme.mode === "dark"
        ? "rgba(26, 26, 26, 0.8)"
        : "rgba(229, 229, 229, 1)"};
    display: inline-block;
    padding: 5px 15px;
    color: rgba(128, 128, 128, 1);
    border-radius: 2rem;
    cursor: copy;
    position: relative;
    user-select: none;
    outline: none;
    border: none;
    &:hover,
    &:focus {
      color: ${(props) =>
        props.theme.mode === "light" ? "black" : props.theme.gray2};
      .address__tooltip {
        display: block;
      }
    }
  }

  .address__tooltip {
    display: none;
    position: absolute;
    top: -100%;
    background-color: ${(props) => props.theme.onBackground};
    /* border: 0.1px solid ${(props) => props.theme.gray4}; */
    /* color: ${(props) => props.theme.primary}; */
    border-radius: 20px;
    padding: var(--padding-1) var(--padding-4);
    font-size: 0.85rem;
  }

  &.show-lg {
    display: none;
  }

  ${breakpoint("lg")} {
    margin: 0;
    position: absolute;
    bottom: 10px;

    &.show-lg {
      display: flex;
    }

    .address {
      /* background-color: rgba(0, 0, 0, 0.8);
      &:hover,
      &:focus {
        color: ${(props) => props.theme.gray3} !important;
      } */
    }
  }
`;
