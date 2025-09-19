import styled from "@emotion/styled";
import { ButtonHTMLAttributes, useContext, useEffect, useState } from "react";
import Navbar from "components/navigation/navbar";
import { useMoralis } from "react-moralis";
import Prompt from "components/prompt";
import Disclaimer from "components/pages/create/disclaimer";
import SelectArtworkType from "components/pages/create/selectArtworkType";
import UploadNFT from "components/pages/create/uploadNft";
import NftDetails from "components/pages/create/nftDetails";
import CreateNftProvider, { CreateNftContext } from "context/createContext";
import MintNFT from "components/pages/create/mintNft";
import LazyMinting from "components/pages/create/freeMint";
import ChoooseType from "components/pages/create/chooseType";
import RightArrow from "components/icons/right arrow";
import LeftArrow from "components/icons/left arrow";
import Head from "next/head";
import { breakpoint } from "public/breakpoint";
import Button from "components/button";
import nProgress from "nprogress";

export default function CreateNft() {
  const { isAuthenticated } = useMoralis();
  useEffect(() => {
    nProgress.done();
  }, []);
  return (
    <>
      <Navbar active="create" />
      <Head>
        <title>Create your NFT</title>
      </Head>
      <CreateNftProvider>
        {isAuthenticated ? (
          <ComposeCreatePages />
        ) : (
          <Prompt
            message="please connect your wallet to view this page"
            title="authentication failed"
            text="Connect wallet"
            href="/connectwallet"
            closeable={false}
          />
        )}
      </CreateNftProvider>
    </>
  );
}

// this component renders the various steps in the create page
function ComposeCreatePages() {
  const { user } = useMoralis();
  // data from create context
  const {
    type,
    data,
    stage,
    incrementStage,
    decreaseStage,
    clearStorage,
    creationType,
  } = useContext(CreateNftContext);

  const generalSteps = 5; //supposed to be six with creation type
  const freeMintingSteps = generalSteps + 2;
  const createSteps = generalSteps + 4;

  // data of the NFT
  const { image, title, description, royalties } = data;
  const [steps, setSteps] = useState(() =>
    type === "create" ? createSteps : freeMintingSteps
  );

  // the width of the progress bar
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [isSparkOpen, setIsSparkOpen] = useState(false);

  useEffect(() => {
    setSteps(type === "create" ? createSteps : freeMintingSteps);
  }, [type]);

  // this helps delay the progress bar from moving
  useEffect(() => {
    setProgressBarWidth(getProgress());

    const t1 = setTimeout(() => {
      setIsSparkOpen(true);
    }, 200);

    // const t2 = setTimeout(() => {
    // }, 150);

    const t3 = setTimeout(() => {
      setIsSparkOpen(false);
    }, 800);
    return () => {
      clearTimeout(t1);
      // clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [stage]);

  const renderer = () => {
    if (stage < 5) {
      switch (stage) {
        case 0:
          if (user?.attributes.agreedToTerms === true) {
            incrementStage();
          }
          return <Disclaimer />;
        case 1:
          return <SelectArtworkType />;
        // case 2:
        //   return <ChoooseType />;
        case 2:
          return <UploadNFT />;
        case 3:
          return <NftDetails />;
      }
    }
    if (type === "create") {
      return <MintNFT />;
    }
    if (type === "free minting") {
      return <LazyMinting />;
    }
  };

  // this function decides if the next button should be disabled
  function disabledNextButton() {
    if (stage === 1) {
      return type ? false : true;
    }
    //  else if (stage === 2) {
    //   return creationType ? false : true;
    // }
    else if (stage === 2) {
      return image ? false : true;
    } else if (stage === 3) {
      return title && description && royalties ? false : true;
    } else if (stage >= 4) {
      return true;
    }
    return false;
  }

  // this function goes back one step
  function gotoPreviousStep() {
    decreaseStage();
  }

  // moves one step further
  function gotoNextStep() {
    incrementStage();
  }

  // this function decides the length of the progress bar
  function getProgress() {
    return (100 / steps) * (stage === 1 ? 0 : stage);
  }

  return (
    <StyledDiv
      className={`${stage < generalSteps ? "create-stage" : "loading-stage"}`}
    >
      <div className={stage > 1 ? "progress-wrapper" : undefined}>
        {stage > 1 && (
          <div className="progress">
            {/*@ts-ignore*/}
            {
              <CreateButton
                onClick={() => gotoPreviousStep()}
                disabled={stage === 1 || stage > 5}
                className="create-btn"
              >
                <LeftArrow />
              </CreateButton>
            }
            <div className="progress__track">
              <div
                className="progress__bar"
                style={{
                  width: `${progressBarWidth}%`,
                  willChange: "width ",
                }}
              ></div>
              {isSparkOpen && (
                <img
                  src="/animations/Spark.gif"
                  alt="spark"
                  style={{
                    transform: `translateX(-50%)`,
                    height: "80px",
                    width: "80px",
                  }}
                />
              )}
            </div>
            {/*@ts-ignore*/}
            {
              <CreateButton
                onClick={() => gotoNextStep()}
                disabled={disabledNextButton()}
                className="create-btn"
              >
                <RightArrow />
              </CreateButton>
            }
          </div>
        )}
      </div>
      {renderer()}
    </StyledDiv>
  );
}

export function CreateBottomButtons() {
  const { stage, incrementStage, type, data } = useContext(CreateNftContext);
  const { image, title, description, royalties } = data;
  // this function decides if the next button should be disabled
  function disabledNextButton() {
    if (stage === 1) {
      return type ? false : true;
    }
    //  else if (stage === 2) {
    //   return creationType ? false : true;
    // }
    else if (stage === 2) {
      return image ? false : true;
    } else if (stage === 3) {
      return title && description && royalties ? false : true;
    } else if (stage >= 4) {
      return true;
    }
    return false;
  }

  return (
    <>
      {stage > 1 && stage < 4 && (
        <StyledBottomButtons>
          <Button
            text="Cancel"
            variant="outline"
            href="/"
            // onClick={() => clearStorage()}
            // size="sm"
            block
          />
          <Button
            text="Next"
            onClick={() => incrementStage()}
            disabled={disabledNextButton()}
            // size="sm"
            block
          />
        </StyledBottomButtons>
      )}
    </>
  );
}

export function CreateButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  outline: none;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  width: 24px;
  height: 24px;

  svg {
    stroke: ${(props) =>
      props.disabled ? props.theme.gray2 : props.theme.primary};
    width: 80%;
    height: auto;
  }

  &:hover,
  &:focus {
    svg {
      stroke: ${(props) => !props.disabled && props.theme.green};
    }
  }
  ${breakpoint("sm")} {
    width: 50px;
    height: 50px;
  }
`;

const StyledBottomButtons = styled.div`
  display: flex;
  width: fit-content;
  align-self: end;
  /* margin: var(--padding-4) auto; */
  margin: var(--padding-8) auto;
  flex-direction: column;
  & > :not(:first-child) {
    margin-top: 1rem;
  }

  ${breakpoint("sm")} {
    flex-direction: row;
    & > :not(:first-child) {
      margin-left: 1rem;
      margin-top: 0;
    }
  }
`;

const StyledDiv = styled.div`
  margin: 0 auto;
  display: grid;
  width: 100%;
  height: calc(100vh - 100px);
  max-height: calc(100vh - 100px);
  grid-template-columns: 1fr;
  position: relative;
  /* overflow: hidden; */
  padding: 0 var(--padding-6);

  &.loading-stage {
    grid-template-rows: max-content 1fr max-content;
  }

  &.create-stage {
    grid-template-rows: max-content 1fr;
  }

  h1 {
    text-transform: capitalize;
    font-size: var(--fontsizes-6);
    text-align: center;
    margin-bottom: 1.3rem;
  }
  .container {
    overflow: auto;
  }

  .progress-wrapper {
    width: 100%;
    z-index: 2;
    background: ${(props) => props.theme.background};
    height: 80px;
    position: sticky;
    top: 100px;
  }
  .progress {
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    display: grid;
    grid-gap: 1rem;
    align-items: center;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    grid-template-columns: max-content 1fr max-content;
    padding: 0 var(--padding-6);

    .create-btn {
      display: flex;
    }

    .sparks {
      /* display: none; */
    }

    .spark {
      display: none;
      font-family: sans-serif;
      svg {
        font-family: sans-serif;
      }
    }
  }
  .progress__track {
    width: 100%;
    height: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: start;
    margin: 0 auto;
    background-color: rgba(199, 199, 199, 0.16);
    position: relative;
  }
  .progress__bar {
    /* width: 0; */
    height: 10px;
    display: block;
    border-radius: 10px;
    /* color: ${(props) => props.theme.gradient}; */
    background-image: ${(props) => props.theme.gradient};
    transition: width 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
    /* transition: width 500ms cubic-bezier(0.22, 1, 0.36, 1); */
    /* transition: width 150ms ease 1s; */
  }

  ${breakpoint("sm")} {
    padding: 0;
    .progress-container {
      grid-template-columns: max-content 1fr max-content;
      .create-btn {
        display: flex;
      }
    }
  }

  ${breakpoint("lg")} {
    h1 {
      font-size: var(--fontsizes-7);
    }
    /* .progress-container {
      margin: var(--padding-7) auto;
    } */
  }

  ${breakpoint("3xl")} {
    .progress-wrapper {
      height: 150px;
    }
  }
`;
