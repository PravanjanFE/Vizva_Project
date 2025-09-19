import { Switch } from "@headlessui/react";
import styled from "@emotion/styled";

export default function Toggle({ state, setState, showLabel = false }) {
  return (
    <StyledToggle checked={state} onChange={setState}>
      <div className={`${state ? "left" : "right"}`}>
        {(() => {
          if (showLabel) {
            return state ? "yes" : "no";
          } else {
            return "";
          }
        })()}
      </div>
    </StyledToggle>
  );
}

const StyledToggle = styled(Switch)`
  min-width: 60px;
  max-width: 60px;
  height: 30px;
  padding: 2px;
  border: 1px solid
    ${(props) => (props.checked ? props.theme.green : props.theme.gray2)};
  background-color: transparent;
  outline: none;
  border-radius: 30px;
  cursor: pointer;
  transition: 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  & > div {
    border-radius: 30px;
    display: grid;
    place-items: center;
    width: 50%;
    height: 100%;
    background-color: ${(props) =>
      props.checked ? props.theme.green : props.theme.gray2};
    transition: 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .right {
    transform: translateX(0);
  }
  .left {
    transform: translateX(100%);
  }
`;
