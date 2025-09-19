import styled from "@emotion/styled";
import { VerifyProfileContext } from "context/verificationContext";
import { breakpoint } from "public/breakpoint";
import { useContext } from "react";

export default function VerifyProfileStepThree() {
  const { updateData, data } = useContext(VerifyProfileContext);

  function updateState(data: "creator" | "collector") {
    updateData(data, "type");
  }

  return (
    <StyledDiv className="container">
      <p>You are a</p>
      <div className="bottom__wrapper">
        <button
          className={data.type === "creator" ? "active" : undefined}
          onClick={() => updateState("creator")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="51"
            fill="none"
            stroke="gray"
            viewBox="0 0 45 51"
          >
            <g
              stroke="inherit"
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath="url(#clip0_655_5953)"
            >
              <path d="M39.086 3.751l3.913 2.282a3 3 0 011.081 4.103L27.546 38.498l-9.114-5.313L34.966 4.822a2.999 2.999 0 014.12-1.07zM39.688 7.08l-15.29 26.23M22.987 35.87l4.57 2.66-4.6 2.63-4.59 2.63.02-5.29.03-5.29 4.57 2.66z"></path>
              <path d="M33.99 36.7v13.76H.5V.5h33.49"></path>
            </g>
            <defs>
              <clipPath id="clip0_655_5953">
                <path fill="inherit" d="M0 0H45V50.96H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <p>Creator</p>
        </button>
        <button
          className={data.type === "collector" ? "active" : undefined}
          onClick={() => updateState("collector")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="57"
            stroke="gray"
            fill="none"
            viewBox="0 0 42 57"
          >
            <g
              stroke="inherit"
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath="url(#clip0_656_5958)"
            >
              <path d="M4.11 50.46v2.77H37.6V3.27h-3.61"></path>
              <path d="M7.758 53.22v2.77h33.48V6.02h-3.61"></path>
              <path d="M33.99.5H.5v49.96h33.49V.5z"></path>
            </g>
            <defs>
              <clipPath id="clip0_656_5958">
                <path fill="inherit" d="M0 0H41.74V56.49H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <p>Collector</p>
        </button>
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  font-size: 1.5rem;
  & > div {
    & > :not(:last-child) {
      margin-right: 1rem;
    }
  }
  & > p {
    padding-bottom: var(--padding-4);
  }
  button {
    background: transparent;
    width: 200px;
    outline: none;
    border: none;
    border-radius: 10px;
    outline: 1px solid ${(props) => props.theme.gray3};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    padding: 10px 20px;
    cursor: pointer;

    &.active {
      outline-color: ${(props) => props.theme.green};
      p {
        color: ${(props) => props.theme.green};
      }

      svg {
        stroke: ${(props) => props.theme.green};
      }
    }

    svg {
      width: 50px;
      height: 50px;
    }

    p {
      margin-left: var(--padding-2);
      letter-spacing: 0.5px;
    }

    &:last-of-type {
      margin-top: var(--padding-4);
    }
  }
  .bottom__wrapper {
    display: flex;
    flex-direction: column;
  }
  ${breakpoint("sm")} {
    button {
      &:last-of-type {
        margin-top: 0;
      }
    }
    .bottom__wrapper {
      display: flex;
      flex-direction: row;
    }
  }
`;
