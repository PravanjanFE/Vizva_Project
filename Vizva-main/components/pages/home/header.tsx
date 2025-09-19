import styled from "@emotion/styled";
import MaxWidth from "components/layout/maxWidth";
import Link from "next/link";
import { breakpoint } from "public/breakpoint";
import { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";

export default function HomeHeader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  function toggleHidden() {
    setHidden((hidden) => !hidden);
  }
  function togglePaused() {
    setPaused((paused) => !paused);
  }
  function play() {
    if (videoRef.current) {
      videoRef.current.play();
      !paused && togglePaused();
    }
  }
  useEffect(() => {
    function onPause() {
      toggleHidden();
    }
    function onPlay() {
      toggleHidden();
    }
    if (videoRef.current) {
      videoRef.current.onpause = onPause;
      videoRef.current.onplay = onPlay;

      return () => {
        videoRef.current?.removeEventListener("onpause", onPause);
        videoRef.current?.removeEventListener("onplay", onPlay);
      };
    }
  }, []);
  return (
    <MaxWidth>
      <StyledHeader>
        <div className="container">
          <div className="video__container">
            <button
              className={`play ${hidden ? "hidden" : ""}`}
              onClick={play}
              aria-label="play intro video"
            >
              <FaPlay size={32} color="black" />
            </button>
            {/* <img
              className={paused ? "hidden" : undefined}
              src="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/Vizva.png?alt=media&token=efec1bbb-49b3-4253-a66a-f7cbd6c51740"
            /> */}
            <video
              ref={videoRef}
              // src="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/vizva.mp4?alt=media&token=1623f77b-d2c0-4953-8483-c1add008aad1"
              src="/videos/vizva.mp4"
              controls={hidden}
              // poster="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/Vizva.png?alt=media&token=efec1bbb-49b3-4253-a66a-f7cbd6c51740"
              poster="/images/Vizva.png"
            ></video>
          </div>
          <div className="text__container">
            <p>Amplify the value of your NFT with Vizva.</p>
            <Link href="/about">
              <a>know more</a>
            </Link>
          </div>
        </div>
      </StyledHeader>
    </MaxWidth>
  );
}

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  min-height: calc(100vh - 100px);
  margin: 0 auto;
  width: fit-content;

  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content max-content;
    gap: var(--padding-9);
  }

  p {
    text-align: center;
    margin-bottom: 30px;
    font-weight: 400;
    font-size: var(--fontsizes-8);
    line-height: 1.2em;
    max-width: 15ch;
  }

  .video__container {
    max-width: 700px;
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 30px;
    overflow: hidden;
    position: relative;

    ${breakpoint("3xl")} {
      max-width: 1000px;
    }
  }

  .play {
    outline: none;
    border: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 100px;
    z-index: 1;
    cursor: pointer;
    &.hidden {
      display: none;
    }
  }

  img {
    width: 100%;
    height: 100%;

    &.hidden {
      display: none;
    }
  }

  video {
    width: 100%;
    object-fit: cover;
    object-position: center;
  }

  .text__container {
    align-self: start;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    a {
      color: ${(props) => props.theme.green};
      transition: 80ms ease;
      font-size: var(--fontsizes-3);
      position: relative;

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background-color: ${(props) => props.theme.green};
        transition: bottom 150ms ease;
      }

      &:hover {
        &::after {
          bottom: -2px;
        }
      }
    }
  }

  ${breakpoint("md")} {
    .container {
      grid-template-columns: auto 300px;
      grid-template-rows: 1fr;
      width: 100%;
    }

    .text__container {
      align-self: center;
      align-items: start;
      justify-self: start;
    }

    p {
      text-align: start;
      max-width: 10ch;
      /* font-size: var(--fontsizes-6); */
    }
    .video__container {
      width: 100%;
    }
  }
`;
