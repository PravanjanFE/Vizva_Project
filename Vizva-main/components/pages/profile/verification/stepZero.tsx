import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import tick from "public/tick.png";
import { breakpoint } from "public/breakpoint";
import { verification } from "entities/keyframes";
import Button from "components/button";
import { VerifyProfileContext } from "context/verificationContext";
import { useContext } from "react";

export default function VerifyProfileStepZero() {
  const { incrementStage } = useContext(VerifyProfileContext);
  return (
    <StyledDiv>
      <div className="icon">
        <Image src={tick} className="image" alt="tick" />
      </div>
      <div className="information">
        <h1>artist verification</h1>
        <p className="description">
          To keep Vizva's users safe, we welcome everyone to proceed with the
          adjusted verification process
        </p>
        <p className="more-information">
          please answer a few questions to apply for a verified badge. here are{" "}
          <Link href="">
            <a>some tips</a>
          </Link>{" "}
          on getting it right
          <span>the verification process usually takes up to 2 weeks</span>
        </p>
        <div className="bottom-buttons">
          <Button variant="outline" text="Cancel" href="/profile/edit" block />
          <Button text="Start" onClick={incrementStage} block />
        </div>
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  overflow: hidden;
  p {
    line-height: 1.5em;
  }
  .icon {
    position: relative;
    max-width: 300px;
    max-height: 300px;
    perspective: 10px;
    animation: ${verification} 2s linear;
  }
  .information {
    display: flex;
    align-items: center;
    /* justify-content: center; */
    flex-direction: column;
    background-color: ${(props) => props.theme.background};
    z-index: 1;
    h1 {
      font-size: var(--fontsizes-7);
      padding-bottom: 1rem;
      text-transform: capitalize;
      line-height: 1.5em;
      text-align: center;
      padding: var(--padding-9) 0 var(--padding-5) 0;
    }

    .description {
      display: block;
    }

    .more-information {
      color: ${(props) => props.theme.gray2};
      margin: var(--padding-6) 0;

      a {
        display: inline-block;
        color: inherit;
        border: none;
        border-bottom: 1px solid white;
        border-style: none none dotted none;

        &:hover {
          color: white;
        }
      }

      span {
        margin-top: 1rem;
        display: block;
      }
    }
  }
  .bottom-buttons {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
    padding: var(--padding-4);
  }
  ${breakpoint("md")} {
    .bottom-buttons {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
    }
    .information {
      text-align: center;

      h1 {
        font-size: var(--fontsizes-8);
        padding-top:0;
      }

      .description {
        max-width: 35ch;
      }
      .more-information {
        max-width: 35ch;
      }
    }
  }
  ${breakpoint("lg")} {
    flex-direction: row;
    margin-top: 0rem;
    .information {
      margin-left: 5em;
    }
  }
`;
