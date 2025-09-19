import styled from "@emotion/styled";
import DiscordIcon from "components/icons/discord";
import Link from "next/link";
import { breakpoint } from "public/breakpoint";
import { FiX } from "react-icons/fi";
import MaxWidth from "components/layout/maxWidth";
import InstagramIcon from "components/icons/instagram";
import TwitterIcon from "components/icons/twitter";
import { Dialog } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";

export default function Footer() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  function toggleHidden() {
    setHidden((hidden) => !hidden);
  }
  function togglePaused() {
    setPaused(!paused);
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
  }, [showVideo, videoRef]);

  function toggleShowVideo() {
    // its about to be closed
    if (showVideo) {
      videoRef?.current?.pause();
    }
    setPaused(false);
    setShowVideo(!showVideo);
  }
  return (
    <StyledFooter>
      <MaxWidth>
        <>
          <section>
            <ul className="footer__list footer__quick-links">
              <li>
                <Link href="/about">
                  <a>About Us</a>
                </Link>
              </li>
              {/* <li>
                <Link href="/">
                  <a>Contact Us</a>
                </Link>
              </li> */}
              <li>
                <Link href="/blogs">
                  <a>Blogs</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a>FAQ's</a>
                </Link>
              </li>
              {/* <li>
                <Link href="/">
                  <a>Join the tribe</a>
                </Link>
              </li> */}
            </ul>

            <aside className="footer__social__container">
              <div className="footer__social__introduction">
                <button onClick={toggleShowVideo}>How Vizva works</button>

                <p className="text">
                  Know how vizva works and all the steps that help you learn
                  from creation to selling your artwork.
                </p>
              </div>

              <div className="footer__social">
                <p>Connect and grow</p>
                <div>
                  <Link href="https://discord.gg/9UD6Kx9mP8">
                    <a target="_blank" aria-label="join our discord community">
                      <DiscordIcon />
                    </a>
                  </Link>
                  <Link href="https://twitter.com/intovizva">
                    <a target="_blank" aria-label="join our twitter community">
                      <TwitterIcon />
                    </a>
                  </Link>
                  <Link href="https://www.instagram.com/intovizva/">
                    <a
                      target="_blank"
                      aria-label="join our instagram community"
                    >
                      <InstagramIcon />
                    </a>
                  </Link>
                </div>
              </div>
            </aside>
          </section>

          <hr />

          <section className="footer__legal">
            <ul className="footer__list footer__legal__list">
              <li>
                <Link href="https://drive.google.com/file/d/19U0UTZ_o2UyS45C3pslTCkPVlhSAvvs0/view?usp=sharing">
                  <a download="Vizva privacy document">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="https://drive.google.com/file/d/1Vq0dZZreX5hFd8Q982PpEW7UJJE-8RO4/view?usp=sharing">
                  <a download="Vizva terms and conditions">
                    Terms & Conditions
                  </a>
                </Link>
              </li>
            </ul>

            <p className="footer__legal__copyright">
              Copyright &copy; Boolien Network. All rights reserved.
            </p>
          </section>

          <Dialog open={showVideo} onClose={toggleShowVideo} as={Fragment}>
            <StyledShowMore>
              <MaxWidth>
                <Dialog.Overlay as={Fragment}>
                  <div className="overlay" onClick={toggleShowVideo}></div>
                </Dialog.Overlay>
                <div className="content">
                  <div>
                    <button className="close" onClick={toggleShowVideo}>
                      <FiX size={24} />
                    </button>
                  </div>
                  <StyledVideoContainer>
                    <button
                      className={`play ${hidden ? "hidden" : ""}`}
                      onClick={play}
                    >
                      <FaPlay size={32} color="black" />
                    </button>
                    {/* <img

                      className={paused ? "hidden" : undefined}
                      src=""
                    /> */}
                    <video
                      ref={videoRef}
                      src="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/know%20more.mp4?alt=media&token=d0211d9e-5169-4729-954c-147d1c4fdf94"
                      poster="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/How%20Vizva%20Works.png?alt=media&token=1d869c12-de13-4fa5-9259-57e94c80b04a"
                      controls={hidden}
                    ></video>
                  </StyledVideoContainer>
                </div>
              </MaxWidth>
            </StyledShowMore>
          </Dialog>
        </>
      </MaxWidth>
    </StyledFooter>
  );
}

const StyledVideoContainer = styled.div`
  max-width: 700px;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 30px;
  overflow: hidden;
  position: relative;

  ${breakpoint("md")} {
    width: 100%;
  }
  ${breakpoint("3xl")} {
    max-width: 1200px;
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
`;

const StyledShowMore = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  display: flex;
  --webkit-backdrop-blur: blur(30px);
  backdrop-filter: blur(30px);

  .overlay {
    position: fixed;
    background-color: ${(props) =>
      props.theme.mode === "dark"
        ? "rgba(0,0,0,0.7)"
        : "rgba(255,255,255,0.8)"};
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
    -webkit-backdrop-blur: blur(30px);
    backdrop-filter: blur(30px);
    filter: blur(50px);
  }

  .content {
    z-index: 1;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 80px auto;
    place-items: center;
    padding-bottom: var(--padding-6);
  }
  .close {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    border-radius: 50%;
    outline: none;
    border: none;
    border: 1px solid ${(props) => props.theme.primary};
    svg {
      transition: transform 150ms ease;
    }

    &:hover,
    &:focus {
      svg {
        transform: rotate(90deg);
        stroke: ${(props) => props.theme.green};
      }
    }
  }
`;

const StyledFooter = styled.footer`
  padding: var(--padding-7) 0;
  margin-top: var(--padding-10);
  background-color: ${(props) => props.theme.onBackground};
  section {
    flex-direction: column;
    display: flex;
    justify-content: space-between;
  }

  p {
    line-height: 1.3em;
  }

  .footer__list {
    display: flex;
    flex-direction: column;
    align-items: start;
    /* justify-content: space-between; */
    list-style: none;
    li {
      /* &:not(:last-of-type) {
        padding-bottom: var(--padding-1);
      } */
      a {
        color: ${(props) => props.theme.primary};
      }
      &:hover {
        a {
          color: ${(props) => props.theme.green};
        }
      }
    }
  }

  hr {
    border-color: ${(props) => props.theme.gray4};
    margin: 2rem 0;
  }

  .footer__quick-links {
    justify-content: space-between;
    a {
      font-size: var(--fontsizes-7);
      font-weight: 350;
    }
    & > :not(:last-child) {
      margin-bottom: var(--padding-4);
    }
  }
  .footer__social__introduction {
    margin-top: var(--padding-7);
    button {
      background: transparent;
      border: 0;
      outline: 0;
      cursor: pointer;
      font-size: var(--fontsizes-7);
      font-weight: 350;
      color: ${(props) => props.theme.primary};

      &:hover {
        color: ${(props) => props.theme.green};
      }
    }
    p {
      max-width: 35ch;

      &.text {
        padding-top: 1rem;
        color: ${(props) => props.theme.gray2};
      }
    }
  }

  .footer__social {
    margin-top: var(--padding-7);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    align-self: end;
    justify-self: flex-end;
    & > div {
      display: flex;
    }
    & > p {
      color: ${(props) => props.theme.gray1};
    }
    a {
      margin-left: 1rem;
      width: 40px;
      height: 40px;
      max-width: 40px;
      max-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${(props) => props.theme.gray3};
      border-radius: 50%;
      &:hover {
        svg {
          &.fill-icon {
            fill: ${(props) => props.theme.green};
          }
          &.stroke-icon {
            stroke: ${(props) => props.theme.green};
          }
        }
      }
    }
    svg {
      width: 20px;
      height: 20px;
      max-width: 20px;
      max-height: 20px;
      &.fill-icon {
        fill: ${(props) => props.theme.primary};
      }
      &.stroke-icon {
        stroke: ${(props) => props.theme.primary};
      }
    }
  }

  .footer__legal__copyright {
    margin-top: 1.5rem;
    color: ${(props) =>
      props.theme.mode === "light" ? props.theme.gray2 : props.theme.gray3};
  }
  .footer__legal__list {
    flex-direction: row;
    & > :not(:last-child) {
      margin-right: 2rem;
    }
    li:not(:last-of-type) {
      padding-bottom: 0;
    }
  }

  ${breakpoint("sm")} {
    .footer__social__introduction {
      margin-top: 0;
    }
    section {
      flex-direction: row;
    }
    /* section:first-of-type > div {
      margin-top: 0;
    } */
    .footer__legal__copyright {
      margin-top: 0;
    }
  }
  ${breakpoint("lg")} {
    margin-top: var(--padding-11);
    section {
      padding: 0 55px;
    }
    .footer__social__introduction {
      margin-top: 0;
    }
  }
  ${breakpoint("3xl")} {
    .heading {
      /* font-size: var(--fontsizes-8); */
    }
    /* & > div:first-child > div {
      & > :first-child > p:last-of-type {
        max-width: 28ch;
      }
    } */
  }
`;
