import styled from "@emotion/styled";
import { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  icon: JSX.Element;
  // filledIcon?: boolean;
  text?: string;
}

export default function ActionButton(props: ActionButtonProps) {
  const { tooltip, icon, text, ...others } = props;
  return (
    <>
      <StyledButton
        {...others}
        data-tooltip={tooltip}
        $text={text ? true : false}
      >
        {text ? (
          <div className="icon-container">
            {icon}
            <p>{text}</p>
          </div>
        ) : (
          <>{icon}</>
        )}
        {tooltip && <div className="tooltip">{tooltip}</div>}
      </StyledButton>
    </>
  );
}

const StyledButton = styled.button<{ $text: boolean }>`
  position: relative;
  background: transparent;
  border: 1px solid ${(props) => props.theme.gray3};
  border-radius: ${(props) => (props.$text ? "30px" : "50%")};
  /* height: ${(props) => (props.$text ? "auto" : "32px")}; */
  /* width: 32px; */
  padding: 8px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  isolation: isolate;

  svg {
    height: 1.3rem;
    width: 1.3rem;
    max-height: 1.3rem;
    max-width: 1.3rem;
  }

  .tooltip {
    position: absolute;
    padding: 5px 10px;
    position: absolute;
    top: 50%;
    right: 150%;
    transform: translate(0, -50%);
    background-color: ${(props) => props.theme.onBackground};
    border-radius: 5px;
    max-width: 300px;
    display: none;
  }

  &::before {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    top: 50%;
    right: calc(130% + 2px);
    transform: translate(0%, -50%) rotate(45deg);
    background-color: ${(props) => props.theme.onBackground};
    max-width: 300px;
    display: none;
  }

  & > .icon-container {
    /* background-color: red; */
    padding: 5px 0;
  }

  &:hover,
  &:focus {
    cursor: pointer;
    &::before,
    & > .tooltip {
      display: block;
    }
  }
`;
