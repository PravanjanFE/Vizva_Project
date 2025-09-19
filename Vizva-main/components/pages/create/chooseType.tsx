import styled from "@emotion/styled";
import { CreateNftContext } from "context/createContext";
import { useRouter } from "next/router";
import { breakpoint } from "public/breakpoint";
import { useContext } from "react";

export default function ChoooseType() {
  const { creationType, updateCreationType, stage } =
    useContext(CreateNftContext);
  return (
    <StyledContainer>
      <h1>Choose Type</h1>
      <p>
        Choose “Single” for one of a kind or “Multiple” if you want to sell one
        collectible multiple times
      </p>
      <div>
        <StyledDiv
          onClick={() => {
            updateCreationType("single");
          }}
          className={creationType === "single" ? "selected" : undefined}
        >
          <div>
            <NftIcon />
          </div>
          <p>Single</p>
        </StyledDiv>
        <StyledDiv
          onClick={() => {
            updateCreationType("multiple");
          }}
          className={creationType === "multiple" ? "selected" : undefined}
        >
          <div>
            <NftIcon />
          </div>
          <p>Multiple</p>
        </StyledDiv>
      </div>
    </StyledContainer>
  );
}

function NftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="161"
      height="139"
      fill="none"
      viewBox="0 0 161 139"
    >
      <path
        fill="#fff"
        d="M101.585 68.17L81.763 87.957 62.113 68.26l19.814-19.786c.385.214 18.242 18.03 19.658 19.696z"
      ></path>
      <path
        fill="#fff"
        d="M115.062 101.675l7.811 7.716-.679.66a100.037 100.037 0 01-15.712 13.018 92.198 92.198 0 01-21.1 10.52 82.485 82.485 0 01-17.455 4.007 70.12 70.12 0 01-16.571 0 58.645 58.645 0 01-27.125-10.042c-9.978-6.928-17.392-16.992-21.083-28.617a62.217 62.217 0 01-3.03-16.002A78.869 78.869 0 015.85 48.918 92.526 92.526 0 0121.635 22.75c2.088-2.474 4.356-4.724 6.55-7.074.189-.206.402-.38.647-.618l19.781 19.844c-.23.198-.418.355-.598.52a70.66 70.66 0 00-10.218 12.366c-5.24 8.088-8.736 16.82-9.71 26.49a40.335 40.335 0 00.72 13.002 28.008 28.008 0 007.075 13.567 27.703 27.703 0 0013.116 7.769 41.088 41.088 0 0016.465.99 57.535 57.535 0 0018.536-5.813 69.602 69.602 0 0018.577-13.71l.541-.503 6.967 6.991c1.613 1.64 3.243 3.323 4.978 5.104z"
      ></path>
      <path
        fill="#fff"
        d="M160.919 63.19A81.845 81.845 0 01153.902 93a96.293 96.293 0 01-18.585 27.801c-.164.173-.336.322-.549.519l-11.896-11.929-7.885-7.767c.147-.203.312-.394.492-.569a70.154 70.154 0 006.165-7.51c6.214-8.847 10.349-18.518 11.29-29.417.493-4.88.031-9.81-1.359-14.51a27.36 27.36 0 00-5.596-10.456 27.126 27.126 0 00-9.477-7.072 34.719 34.719 0 00-14.287-3.042 51.21 51.21 0 00-18.266 3.215 67.223 67.223 0 00-22.99 14.189c-.14.122-.288.235-.443.338L48.645 34.878 40.71 26.97c.287-.264.647-.495.892-.725A96.762 96.762 0 0165.347 9.707a86.158 86.158 0 0122.327-7.47 73.741 73.741 0 0118.414-1.162 60.187 60.187 0 0125.561 7.206c13.665 7.585 22.573 19.045 26.945 34.1a65.193 65.193 0 012.325 20.808z"
      ></path>
    </svg>
  );
}

const StyledContainer = styled.div`
  padding-bottom: 2rem;
  width: 100%;
  min-height: calc(100vh - 300px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h1 {
    font-size: var(--fontsizes-7);
    text-align: center;
  }
  & > p {
    text-align: center;
    max-width: 40ch;
    margin: 1rem auto;
    line-height: 1.5em;
  }
  & > div {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    & > :first-of-type {
      & > div {
        background: linear-gradient(133.98deg, #fce048 3.84%, #09cf5a 99.92%);
      }
      margin: 20px var(--padding-5) 0 var(--padding-5);
    }

    & > :last-child {
      & > div {
        background: linear-gradient(127.88deg, #eb35d1 1.73%, #fce048 98.45%);
      }
      margin: 20px var(--padding-5) 0 var(--padding-5);
    }
  }
  ${breakpoint("3xl")} {
    padding-top: var(--padding-10);
  }
`;
const StyledDiv = styled.button`
  outline: none;
  background: transparent;
  max-width: 350px;
  height: calc(350px * 1);
  width: 100%;
  /* height: 130%; */
  padding: 2rem;
  display: grid;
  grid-template-rows: 1fr max-content;
  gap: var(--fontsizes-4);
  position: relative;
  cursor: pointer;
  isolation: isolate;
  border: 1px solid ${(props) => props.theme.gray400};
  border-radius: 2rem;

  &.selected {
    border-color: ${(props) => props.theme.green};
    p {
      color: ${(props) => props.theme.green};
    }
  }

  & > div {
    pointer-events: none;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 100%;
    flex-shrink: 0;
    height:100%;
    /* height: 250px; */
    /* height:200%; */
    /* padding: 50px 0; */
  }

  p {
    font-size: var(--fontsizes-4);
    text-align: center;
  }

  svg {
    width: 120px;
    height: auto;
  }

  &:focus,
  &:hover {
    border-color: ${(props) => props.theme.green};
  }

  &:last-child {
    position: relative;

    & > div {
      position: relative;
      border-top: 2px solid white;

      &::before {
        content: "";
        position: absolute;
        width: 80%;
        height: 100%;
        top: -20px;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: -1;
        border-radius: 2rem 2rem 0 0;
        background: #eb35d1;
      }

      &::after {
        content: "";
        position: absolute;
        border-top: 2px solid white;
        width: 90%;
        height: 100%;
        top: -13px;
        left: 50%;
        transform: translate(-50%, 0px);
        z-index: -1;
        border-radius: 2rem 2rem 0 0;
        background: #eb35d1;
      }
    }
  }

  ${breakpoint("lg")} {
    & > div {
      /* padding: 80px 0; */
    }
  }
`;
