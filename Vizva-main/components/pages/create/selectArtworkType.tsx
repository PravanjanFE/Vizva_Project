import styled from "@emotion/styled";
import { CreateNftContext } from "context/createContext";
import { useRouter } from "next/router";
import { breakpoint } from "public/breakpoint";
import { useContext } from "react";
import * as Fi from "react-icons/fi";

export default function SelectArtworkType() {
  const { updateType, data, type } = useContext(CreateNftContext);
  const router = useRouter();
  return (
    <StyledContainer>
      <StyledButton
        onClick={() => {
          updateType("create");
        }}
        className={type === "create" ? "selected" : undefined}
      >
        <div>
          {type === "create" && (
            <div className="tick">
              <Fi.FiCheck size="20" color="#ffffff" />
            </div>
          )}
          <h1>Create</h1>
          <p>
            Mint your artwork into an NFT by the traditional wallet mechanism.
          </p>
        </div>
        <div className="faker"></div>
      </StyledButton>
      <StyledButton
        onClick={() => {
          updateType("free minting");
        }}
        className={type === "free minting" ? "selected" : ""}
      >
        <div>
          {type === "free minting" && (
            <div className="tick">
              <Fi.FiCheck size="20" color="#ffffff" />
            </div>
          )}
          <h1>Free Minting</h1>
          <p>
            Create your artwork into an NFT without paying any gas fee.
            <br />
            <br />
            Buyer will pay for it and after the purchase it is transferred onto
            blockchain.
          </p>
        </div>
        <div className="faker"></div>
      </StyledButton>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 120px);
  display: flex;
  /* flex-wrap: wrap; */
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding-top: calc(200px + var(--padding-6));
  & > :last-child {
    margin-top: 3rem;
  }

  ${breakpoint("sm")} {
    padding-top: calc(180px + var(--padding-8));
  }
  ${breakpoint("lg")} {
    padding-top: 0;
    flex-direction: row;
    & > :last-child {
      margin-left: 3rem;
      margin-top: 0;
    }
  }
`;

const StyledButton = styled.button`
  outline: none;
  border: none;
  background: transparent;
  max-width: 450px;
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 2rem;
  position: relative;
  cursor: pointer;
  isolation: isolate;
  /* background: blue; */
  & > .faker {
    padding-top: 60%;
  }
  &.selected {
    &::after {
      border-color: ${(props) => props.theme.green};
    }
  }

  h1 {
    font-size: var(--fontsizes-7);
    margin-bottom: 0.85rem;
    text-align: center;
  }

  .tick {
    position: absolute;
    right: 30px;
    top: 30px;
    background-color: ${(props) => props.theme.green};
    border-radius: 50%;
    height: 30px;
    width: 30px;
    display: none;
    place-items: center;
  }

  p {
    text-align: center;
    line-height: 1.5em;
    /* font-size: 16px; */
  }

  &:focus,
  &:hover {
    &::after {
      border-color: ${(props) => props.theme.green};
    }
  }

  &::after {
    content: "";
    position: absolute;
    border: 1px solid ${(props) => props.theme.gray4};
    height: 70%;
    width: 100%;
    border-radius: 200px;
    z-index: -1;
  }
  &::before {
    content: "";
    position: absolute;
    height: 50px;
    width: 50px;
    border: 1px solid ${(props) => props.theme.green};
    border-radius: 100%;
    z-index: -1;
    opacity: 0.5;
  }
  &:first-of-type {
    &::after {
      transform: rotate(50deg);
      left: -1%;
      top: 10%;
      width: 90%;
    }
    &::before {
      top: 20%;
      left: -2%;
    }
  }
  &:last-of-type {
    &::after {
      transform: rotate(-190deg);
      height: 50%;
      /* max-height: 200px; */
    }
    &::before {
      top: 40%;
      right: -5%;
    }
  }
  ${breakpoint("sm")} {
    &:last-of-type {
      &::after {
        height: 100%;
      }
    }
  }
  ${breakpoint("md")} {
    &::before {
      height: 80px;
      width: 80px;
    }
  }
  ${breakpoint("3xl")} {
    h1 {
      font-size: var(--fontsizes-8);
    }
  }
`;
