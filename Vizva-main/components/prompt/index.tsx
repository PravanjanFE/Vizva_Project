import styled from "@emotion/styled";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { Global } from "@emotion/react";
import Button from "components/button";
import { breakpoint } from "public/breakpoint";
import Image from "next/image";

/**
 *
 * @param {Object} props - receives a message objects with describes the type of prompt
 * @param {string} props.title - the title of the prompt
 * @param {string} props.message - a description of the title of the prompt
 * @param {string} props.href - a page to direct to once the button is clicked
 * @param {string} props.onClick - a function that fires once the button is clicked
 * @param {string} [props.text] - the title of the button
 * @param {boolean} [props.closeable = true] - defines if the modal can be closed by the user
 */

interface Props {
  title?: string;
  /**
   * @desc message to display in the prompt
   */
  message?: string;
  href?: string;
  onClick?: () => void;
  /**
   * @desc title of the button. Used along side the href and onClick props
   */
  text?: string;
  /**
   * @desc header image to display
   */
  image?: string;
  /**
   * @desc defines if a prompt can be closed without taking an action
   * @default true
   */
  closeable?: boolean;
}
export default function Prompt(props: Props) {
  const {
    title,
    message,
    href,
    onClick,
    text,
    image,
    closeable = true,
  } = props;
  const [isOpen, setIsOpen] = useState(true);

  function close() {
    closeable ? setIsOpen(false) : () => {};
  }

  function clickHandler() {
    onClick && onClick();
  }

  // if (!message) {
  //   throw new Error("a message prompt is requires for a <Prompt/>");
  // }
  if (text && !onClick && text && !href) {
    throw new Error(
      "a text cannot be passed without a `href` or `onClick` props for a <Prompt/>"
    );
  }
  if ((onClick && !text) || (href && !text)) {
    throw new Error(
      "provide a `text` value if you want to use a `href` or `onClick` on a <Prompt/>"
    );
  }
  if (closeable && !text) {
    throw new Error("this <Prompt/> cannot be closed");
  }

  return (
    <>
      <Global
        styles={{
          body: {
            overflow: "hidden",
          },
        }}
      />
      <Dialog open={isOpen} onClose={() => close()}>
        <StyledBackground
          $isOpen={isOpen}
          onClick={close}
          $closeable={closeable}
        />

        <StyledDiv
          $isOpen={isOpen}
          aria-modal="true"
          role="dialog"
          aria-labelledby="dialogTitle"
          aria-describedby="dialogDescription"
        >
          {image && (
            <Image
              alt="prompt"
              objectFit="contain"
              src={image}
              height={100}
              width={100}
              style={{
                margin: "0 auto",
              }}
            />
          )}
          <h3 id="dialogTitle">{title}</h3>
          {message && <p id="dialogTitle">{message}</p>}
          {text && (
            <Button
              variant="outline"
              size="sm"
              href={href}
              onClick={clickHandler}
              text={text}
            />
          )}
          {closeable && (
            <button className="close-btn">
              <FiX onClick={close} size="20" />
            </button>
          )}
        </StyledDiv>
      </Dialog>
    </>
  );
}

const StyledBackground = styled.div<{ $isOpen: boolean; $closeable: boolean }>`
  position: fixed;
  background-color: ${(props) => props.theme.backdrop};
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  z-index: 1000;
`;

const StyledDiv = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  left: 50%;
  top: ${(props) => (props.$isOpen ? "50%" : "100%")};
  transform: ${(props) =>
    props.$isOpen ? "translate(-50%, -50%)" : "translateX(100%)"};
  z-index: 1001;
  border-radius: 10px;
  background-color: ${(props) => props.theme.onBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px;
  width: 90vw;
  max-width: 500px;
  border: 1px solid ${(props) => props.theme.gray4};
  color: ${(props) => props.theme.primary};

  h3 {
    text-transform: capitalize;
    text-align: center;
    line-height: 1.2em;
    font-size: var(--fontsizes-5);
  }
  p {
    max-width: 30ch;
    text-align: center;
    line-height: 1.2em;
    margin: 0.5rem 0;
    color: ${(props) => props.theme.gray1};
  }
  button.close-btn {
    &:first-of-type {
      margin-top: 10px;
    }
    &:last-child {
      position: absolute;
      right: 3%;
      top: 5%;
      transform: translate(-3%, -5%);
      cursor: pointer;
      border: none;
      display: grid;
      place-items: center;
      background-color: transparent;
      outline-color: transparent;

      &:hover,
      &:focus {
        outline: 2px solid ${(props) => props.theme.green};
        border-radius: 0.1rem;
        svg {
          transform: scale(1.05);
        }
      }
    }
  }

  ${breakpoint("lg")} {
    h3 {
      font-size: var(--fontsizes-6);
    }
  }
`;
