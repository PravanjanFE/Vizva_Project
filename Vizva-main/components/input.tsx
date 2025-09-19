import styled from "@emotion/styled";
import { spinner } from "entities/keyframes";
import { breakpoint } from "public/breakpoint";
import React, {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface BaseProps {
  label?: string;
  appearance?: string;
  infoText?: string;
  errorText?: string;
  loading?: boolean;
  showLength?: boolean;
  error?: boolean;
  icon?: ReactNode | JSX.Element;
  subLabel?: string;
  outline?: boolean;
  moreInfo?: JSX.Element;
}
interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {}
interface TextAreaProps
  extends InputHTMLAttributes<HTMLTextAreaElement>,
    BaseProps {}
export default function Input(props: InputProps | TextAreaProps) {
  const {
    appearance,
    infoText,
    maxLength,
    showLength = false,
    icon,
    error = false,
    errorText,
    loading = false,
    outline = false,
    subLabel,
    moreInfo,
    ...others
  } = props;
  const { id, className, label, value, type = "text" } = others;

  const Icon = icon;
  const showIcon = icon ? true : false;
  const setHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "6rem";
    (e.target.parentElement as HTMLElement).style.height =
      e.target.scrollHeight + "px";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    if (textarea.current != null) {
      textarea.current.style.height = "6rem";
      (textarea.current.parentElement as HTMLElement).style.height =
        textarea.current.scrollHeight + 10 + "px";
      textarea.current.style.height = textarea.current.scrollHeight + 10 + "px";
    }
  }, []);

  return (
    <StyledInput
      className={`${className ? className : ""} ${
        outline ? "outline-input" : ""
      }`}
      $icon={showIcon}
    >
      {appearance != "bottom-row" && label && (
        <div className="input__label">
          <label htmlFor={id}>{label}</label>
          {props.required && <span className="required">*</span>}
          {moreInfo && (
            <div className="more-info__wrapper">
              <button
                className="more-info"
                type="button"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
              >
                i
              </button>
              <div
                onMouseLeave={() => setIsInfoOpen(false)}
                className={`more-info__container ${
                  isInfoOpen ? "more-info__container--open" : ""
                }`}
              >
                {moreInfo}
              </div>
            </div>
          )}
          {/* {moreInfo && <div className="more-info__container">{moreInfo}</div>} */}
        </div>
      )}
      {subLabel && <p className="sub-label">{subLabel}</p>}

      <StyledInputContainer
        appearance={appearance}
        $icon={showIcon}
        $type={type}
        $error={error}
        className={`${outline ? "outline-input" : ""}`}
      >
        {type !== "textarea" && (
          <input
            {...(others as InputProps)}
            maxLength={maxLength}
            autoComplete="off"
          />
        )}
        {type === "textarea" && (
          <textarea
            {...(others as TextAreaProps)}
            maxLength={maxLength}
            value={props.value}
            ref={textarea}
            onInput={setHeight}
            autoComplete="off"
          ></textarea>
        )}
        {type !== "textarea" && showIcon && <div>{Icon}</div>}
        {loading && <div className="loading"></div>}
      </StyledInputContainer>
      {(infoText ||
        maxLength ||
        (error && errorText) ||
        infoText ||
        showLength) && (
        <StyledBottomRow appearance={appearance}>
          {/* display the infoText if the input is not in an error state */}
          {infoText && !error && <p>{infoText}</p>}
          {errorText && error && <p className="error-text">{errorText}</p>}
          {showLength ||
            (maxLength && (
              <div className="counter">
                {(showLength || maxLength) && (
                  <span>{(value as string).length}</span>
                )}
                {maxLength && (
                  <>
                    <span className="divider">/</span>
                    <span>{maxLength ? maxLength : 150}</span>
                  </>
                )}
              </div>
            ))}
        </StyledBottomRow>
      )}
    </StyledInput>
  );
}

const StyledBottomRow = styled.div<{ appearance?: string }>`
  padding-top: 0.3rem;
  /* padding: 0.3rem 16px 0; */
  /* padding-left: ${(props) =>
    props.appearance == "bottom-row" ? `10px` : "20px"}; */
  display: grid;
  width: 98%;
  margin: 0 auto;
  grid-template-columns: 1fr auto;
  align-items: center;

  p {
    font-size: 0.725rem;
    color: ${(props) => props.theme.gray2};
    line-height: 1.3em;

    &.error-text {
      color: red;
    }
  }

  .counter {
    span {
      font-size: 0.95rem;
      color: ${(props) => props.theme.gray2};
    }
    width: 100%;
    text-align: end;
  }

  .divider {
    padding: 0 0.3rem;
  }

  ${breakpoint("sm")} {
    p {
      font-size: 0.85rem;
    }
  }

  ${breakpoint("3xl")} {
    line-height: 1.1em;
  }
`;
const StyledInputContainer = styled.div<{
  appearance?: string;
  $icon: boolean;
  $type: string;
  $error: boolean;
}>`
  position: relative;
  height: ${(props) => (props.$type !== "textarea" ? "50px" : "6rem")};
  isolation: isolate;
  border-radius: 0.2rem;
  background: ${(props) => props.theme.formBackground};
  /* background-color: ${(props) =>
    props.theme.mode == "dark"
      ? props.theme.formBackground
      : props.theme.gray300}; */
  width: 100%;

  &.outline-input {
    background: transparent !important;

    input,
    textarea {
      outline: 2px solid ${(props) => props.theme.gray4};
    }
  }

  input {
    padding: ${(props) =>
      props.appearance == "bottom-row" ? `0 10px` : "0 20px"};
    padding-right: ${(props) => (props.$icon ? "50px" : "20px")};
  }

  input,
  textarea {
    position: absolute;
    inset: 0;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
    /* font-size: 1rem; */
    font-weight: 300;
    user-select: unset;
    color: ${(props) =>
      props.theme.mode == "dark" ? props.theme.gray400 : "black"};
    background-color: transparent;
    z-index: 10;
    border-radius: inherit;

    background-color: transparent;
    border: none;
    outline: none;

    outline: ${(props) => (props.$error ? "2px solid red" : "")} !important;
    outline-offset: -2px;

    &:focus {
      outline: ${(props) =>
        props.appearance == "bottom-row"
          ? `none`
          : `2px solid ${props.$error ? "red" : props.theme.green}`} !important;
      border-bottom: ${(props) =>
        props.appearance == "bottom-row"
          ? `2px solid ${props.$error ? "red" : props.theme.green}`
          : `none`} !important;
    }
  }

  textarea {
    /* position: absolute; */
    /* inset: 0; */
    min-height: 6rem;
    /* max-width: 800px; */
    overflow: hidden;
    width: 100%;
    user-select: unset;
    padding: ${(props) =>
      props.appearance == "bottom-row" ? `10px` : "10px 20px"};
    color: ${(props) =>
      props.theme.mode == "dark" ? props.theme.gray400 : "black"};
    background-color: transparent;
    justify-content: start;
    resize: none;
    line-height: 1.5em;

    /* overflow-y: auto;
    overflow-x: hidden; */
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  /* icon */
  & > div {
    z-index: -1;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50px;
    height: 100%;
    display: grid;
    place-items: center;
  }

  div.loading {
    position: absolute;
    background-color: transparent;
    width: 35px;
    height: 35px;
    right: 0%;
    top: 50%;
    border-radius: 50%;
    border: 3px solid rgba(133, 158, 133, 0.384);
    border-bottom: 3px solid ${(props) => props.theme.green};
    animation: ${spinner} 1.5s linear infinite;
  }
`;
const StyledInput = styled.div<{ $icon: boolean }>`
  width: 100%;

  .input__label {
    display: flex;
    margin-bottom: 0.5rem;
    line-height: 1.2em;
    width: 100%;
  }
  label {
    display: inline-block;
    text-transform: capitalize;
  }

  .more-info__wrapper {
    position: relative;
    flex-basis: initial;
  }
  .more-info__container {
    display: none;
    opacity: 0;
    position: absolute;
    z-index: 1;
    background-color: ${(props) =>
      props.theme.mode === "dark" ? "#4b4a4a" : "#f0f0f0"};
    padding: var(--padding-5);
    border-radius: 20px;
    top: 26px;
    right: -160px;
    width: max-content;
    max-width: max-content;
    transition: opacity 150ms ease;
    box-sizing: content-box;

    &.more-info__container--open {
      display: block;
      opacity: 1;
    }
  }

  .required {
    color: ${(props) => props.theme.green};
  }

  .sub-label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.gray2};
  }

  .more-info {
    background-color: ${(props) => props.theme.gray4};
    font-size: 0.7rem;
    line-height: 16px;
    width: 16px;
    height: 16px;
    /* display: inline-block; */
    text-transform: lowercase;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    color: inherit;
    outline: none;
    border: none;
    cursor: pointer;
    margin-left: 0.2rem;

    &:hover,
    &:focus {
      background-color: ${(props) => props.theme.gray3};
    }
  }

  @media screen and (min-width: 451px) {
    .more-info__container {
      top: 26px;
      right: -40vw;
    }
  }

  @media screen and (min-width: 600px) {
    .more-info__container {
      top: 0;
      left: 1.5em;
    }
  }

  /* ${breakpoint("sm")} {
  } */
`;
