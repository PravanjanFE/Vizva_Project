import styled from "@emotion/styled";
import { Dialog } from "@headlessui/react";
import { spinner2 } from "entities/keyframes";
import { breakpoint } from "public/breakpoint";
import { useEffect, useRef } from "react";

interface LoadingProps {
  /**
   * @default Loading
   */
  title?: string;
  message?: string;
  isOpen: boolean;
}

export default function Loading({ title, message, isOpen }: LoadingProps) {
  const modal = useRef<HTMLDivElement>(null);

  // trap focus
  useEffect(() => {
    if (!modal) return;
    document.addEventListener("keydown", function (e) {
      let isTabPressed = e.key === "Tab" || e.keyCode === 9;

      if (!isTabPressed || modal.current === null) {
        return;
      }

      modal.current.focus();

      e.preventDefault();
    });

    return () => document.removeEventListener("keydown", () => {});
  }, []);

  // stop page scroll
  useEffect(() => {
    if (!isOpen) return;
    const html = document.querySelector("html");
    if (!html) return;
    html.style.overflow = "hidden";
    html.style.paddingRight = "0";
    return () => {
      const html = document.querySelector("html");
      if (!html) return;
      html.style.overflow = "auto";
      html.style.paddingRight = "0px";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <StyledContainer ref={modal}>
      <StyledBackground />
      <StyledDiv>
        <div className="loading"></div>
        <h2>{title ?? "Loading"}</h2>
        {message && <p>{message}</p>}
      </StyledDiv>
    </StyledContainer>
  );
}

const StyledBackground = styled.div`
  position: fixed;
  background-color: ${(props) => props.theme.backdrop};
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.8;
  display: block;
  z-index: 1000;
`;

const StyledDiv = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  border-radius: 10px;
  background-color: ${(props) => props.theme.onBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 10px; */
  padding: 30px;
  width: 90vw;
  max-width: 500px;
  border: 1px solid ${(props) => props.theme.gray4};
  & > :not(:last-child) {
    margin-bottom: 10px;
  }
  .loading {
    width: 100px;
    height: 100px;
    border: 2px solid ${(props) => props.theme.gray300};
    border-top-color: ${(props) => props.theme.gray800};
    border-radius: 50%;
    animation: ${spinner2} 0.5s linear infinite;
  }

  h2 {
    text-transform: capitalize;
    line-height: 1.2em;
    font-size: var(--fontsizes-5);
    color: ${(props) => props.theme.primary};
  }
  p {
    color: ${(props) => props.theme.primary};
    max-width: 30ch;
    text-align: center;
    font-size: var(--fontsizes-3);
  }
  button {
    margin-top: 10px;
  }
  svg {
    position: absolute;
    right: 3%;
    top: 5%;
    transform: translate(-3%, -5%);
    cursor: pointer;
  }

  ${breakpoint("lg")} {
    h3 {
      font-size: var(--fontsizes-6);
    }
  }
`;

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
`;
