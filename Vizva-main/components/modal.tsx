import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Dialog } from "@headlessui/react";
import { CSSProperties, HTMLAttributes } from "react";
import * as Fi from "react-icons/fi";
import Button from "./button";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
  header?: string;
  closeModal(): void;
  isOpen: boolean;
  primaryBtnAction?: () => void;
  primaryBtnText?: string;
  primaryBtnLoading?: boolean;
  primaryBtnDisabled?: boolean;
  secondaryBtnAction?: () => void;
  secondaryBtnText?: string;
  secondaryBtnLoading?: boolean;
  secondaryBtnDisabled?: boolean;
}

/**
 * @desc the modal is used as a wrapper for any element you wish to put in a modal. it accepts two buttons a primary and secondary button
 */

export default function Modal({
  isOpen, // indicates the open state of the modal
  children, // what is displayed
  header, // title of the modal
  closeModal, // close the modal
  primaryBtnAction, // what fires when the primary button is clicked
  primaryBtnText, // what displays in the primary button
  primaryBtnLoading = false, // loading state of primary button
  primaryBtnDisabled = false, // disabled state of primary button
  secondaryBtnAction, // what fires when the secondary button is clicked
  secondaryBtnText, // what displays in the secondary button
  secondaryBtnLoading = false, // loading state of secondary button
  secondaryBtnDisabled = false, // disabled state of secondary button
  ...others
}: ModalProps) {
  return (
    <>
      <Global
        styles={{
          body: {
            overflow: "hidden",
          },
        }}
      />
      {/* the modal is not closeable once any button is in a loading state */}
      <Dialog
        open={isOpen}
        onClose={
          !secondaryBtnLoading && !primaryBtnLoading ? closeModal : () => {}
        }
      >
        {/* if a header is passed follow the header content bottom buttons approach */}
        {header && (
          <>
            <StyledDiv {...others}>
              <header>
                <label>{header}</label>
                <button onClick={closeModal}>
                  <Fi.FiX />
                </button>
              </header>
              <main>{children}</main>
              <div>
                {secondaryBtnText && (
                  <Button
                    variant="outline"
                    text={secondaryBtnText}
                    onClick={secondaryBtnAction}
                    loading={secondaryBtnLoading}
                    disabled={secondaryBtnDisabled}
                  />
                )}
                {primaryBtnText && (
                  <Button
                    text={primaryBtnText}
                    onClick={primaryBtnAction}
                    loading={primaryBtnLoading}
                    disabled={primaryBtnDisabled}
                  />
                )}
              </div>
            </StyledDiv>
          </>
        )}
        {/* if no header is passed, display the children bare */}
        {!header && <>{children}</>}

        <StyledBackground
          // the modal is not closeable once any button is in a loading state
          onClick={
            !secondaryBtnLoading && !primaryBtnLoading ? closeModal : () => {}
          }
        ></StyledBackground>
      </Dialog>
    </>
  );
}

const StyledDiv = styled.div`
  z-index: 9999;
  background-color: ${(props) => props.theme.onBackground};
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.gray2};
  border-radius: 20px;
  max-width: 600px;
  width: 90vw;
  height: auto;
  max-height: 90vh;
  padding: 20px 40px 40px 40px;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: grid;
  grid-template-rows: max-content 1fr max-content;

  & > header {
    /* padding: 20px 0; */
    position: relative;
    /* background:red; */
    /* height: 50px; */
    button {
      position: absolute;
      right: 0px;
      top: 0;
      display: grid;
      place-items: center;
      height: 30px;
      width: 30px;
      background: transparent;
      outline: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      &:hover,
      &:focus {
        outline: 2px solid ${(props) => props.theme.green};
      }
    }
    svg {
      font-size: 1.2rem;
    }
    label {
      color: ${(props) => props.theme.primary};
      display: block;
      font-weight: 500;
      width: 100%;
      text-align: center;
      font-size: var(--fontsizes-3);
      text-transform: capitalize;
    }
  }
  & > main {
    padding: 20px;
    overflow: auto;
  }
  & > :last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    /* padding: 40px 0; */

    & > :not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

export const StyledBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  z-index: 99;
`;
