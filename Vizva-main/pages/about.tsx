import styled from "@emotion/styled";
import Navbar from "components/navigation/navbar";
import { breakpoint } from "public/breakpoint";
import Button from "components/button";
import Footer from "components/pages/home/footer";
import { useContext } from "react";
import { ThemeContext } from "context/themeContext";
import MaxWidth from "components/layout/maxWidth";
import Head from "next/head";

const upcoming = [
  {
    light: "/images/About Us/1. curated/light.png",
    dark: "/images/About Us/1. curated/dark.png",
    heading: "Curated NFT Packs",
    text: "The virtual world is your open canvas. Create your pack of favourite NFTs and trade within your tribe. ",
    left: false,
  },
  {
    light: "/images/About Us/2. pool/light.png",
    dark: "/images/About Us/2. pool/dark.png",
    heading: "NFT Pools and Farming",
    text: "Choose from a diverse pool of NFT projects to farm on and earn a passive income with your clan.",
    left: true,
  },
  {
    light: "/images/About Us/3. backing/light.png",
    dark: "/images/About Us/3. backing/dark.png",
    heading: "Backing your project with NFT’s",
    text: "Accelerate your project with the support of loyal fans and believers. As fans back your project, they get reward with NFT's and you get that much closer to realising your project.",
    left: false,
  },
  {
    light: "/images/About Us/4. games/light.png",
    dark: "/images/About Us/4. games/dark.png",
    heading: "Games with NFT’s",
    text: "With surprise in-game launches and user-immersive experiences, you can earn on the go while playing reality-bending games.",
    left: true,
  },
];

export default function UpcomingFeatures() {
  const { mode } = useContext(ThemeContext);
  return (
    <>
      <Head>
        <title>About Vizva</title>
      </Head>
      <Navbar />
      <StyledDiv>
        <header>
          {mode === "dark" ? (
            <img
              src="/images/About Us/landing page/dark.png"
              alt="connect"
              loading="lazy"
            />
          ) : (
            <img
              src="/images/About Us/landing page/light.png"
              alt="connect"
              loading="lazy"
            />
          )}

          <div>
            <h2>
              Shape the
              <br />
              Metaverse
            </h2>
            <p>
              Leave your legacy behind in the fast-expanding metaverse - create,
              trade and farm digital collectibles to activate our decentralised
              economy.
            </p>
          </div>
        </header>

        {upcoming.map((coming) => (
          <section className={coming.left ? "block-left" : "block-right"}>
            <div className="image-container">
              {mode === "dark" ? (
                <img src={coming.dark} alt="section" loading="lazy" />
              ) : (
                <img src={coming.light} alt="section" loading="lazy" />
              )}
            </div>
            <div>
              <h1>{coming.heading}</h1>
              <p>{coming.text}</p>
            </div>
          </section>
        ))}

        <MaxWidth>
          <article>
            <h1>Founder Thought</h1>
            <div>
              <p>
                NFT and blockchain are our chosen tools to bring a community of
                like-minded creatives and creative enthusiasts together. In this
                decentralised community, you can passionately create what you
                desire and showcase your skills.
              </p>
              <div>
                <p>
                  And, this decentralised economy is limitless - the metaverse
                  is yours to create. It will grow as much as you want it to
                  grow. You can imagine new worlds and build passion projects
                  that you have always wanted to build.
                </p>
                <p>
                  We are committed to supporting you in every way possible to
                  expand this creative universe. We invite you to join us and
                  shape the metaverse however you want.
                </p>
              </div>
            </div>
          </article>
        </MaxWidth>

        <div className="footer">
          <div>
            <p>
              By the creators,
              <br />
              for the creators
            </p>
            <Button
              text="Join Us"
              // size="sm"
              href="https://forms.gle/LgjgahqiF7WxBP2m7"
            />
          </div>
        </div>

        {/* <div className="footer">
          </div> */}
      </StyledDiv>
      {/* <Footer /> */}
      {/* </MaxWidth> */}
    </>
  );
}

const StyledDiv = styled.div`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.primary};

  header > h1,
  article > h1 {
    font-size: 4em;
    font-weight: bold;
    background-image: ${(props) => props.theme.gradient};
    background-clip: text;
    color: transparent;
  }

  header {
    position: relative;
    min-height: calc(100vh - 74px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    margin-bottom: var(--padding-10);

    h1 {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -250%);
    }

    img {
      width: 100%;
      min-height: 100vh;
      object-fit: cover;
      object-position: 50% 50%;
    }

    div {
      position: absolute;
      bottom: 0%;
      right: 12%;
      display: flex;
      flex-direction: column;
      align-items: center;

      h2 {
        font-size: 3rem;
        line-height: 1em;
        font-weight: normal;
      }

      p {
        margin-left: 2rem;
        margin-top: 1rem;
        max-width: 40ch;
        font-size: var(--fontsizes-1);
        line-height: 1.3em;
      }
    }
  }

  section {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 120px;

    &.block-right > .image-container {
      direction: rtl;
    }

    &.block-right {
      flex-direction: column;
    }
    img {
      max-width: 75%;
    }
    div {
      max-width: 40ch;
      h1 {
        font-weight: bold;
        font-size: 3em;
        line-height: 1.2em;
        padding: 0 1rem;
      }
      p {
        font-size: var(--fontsizes-3);
        line-height: 1.8em;
        padding: 0 1rem;
        padding-top: 1rem;
        color: ${(props) => props.theme.primary};
      }
    }
  }

  article {
    padding: 0 1rem;
    margin: 0 auto;
    margin-top: 5rem;
    h1 {
      margin-bottom: 2rem;
    }
    & > div {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;

      p {
        font-size: var(--fontsizes-3);
        line-height: 1.8em;
      }
      div > p:last-child {
        margin-top: 3rem;
      }
    }
  }

  & > div:not(:last-of-type) {
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 5rem;
    & > div:last-of-type {
    }
    & > div:nth-of-type(2) {
      height: 3rem;
    }
    & > div {
      position: relative;
      width: 30ch;
      margin: 0 auto;
      &::before {
        position: absolute;
        inset: 0;
        height: 100%;
        width: 100%;
        border-radius: 100px;
        border: 1px solid ${(props) => props.theme.green};
        z-index: 1;
      }
      .faker {
        margin-top: 70%;
      }
      .wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        h2 {
          font-size: 2.5rem;
        }
        p {
          font-size: 1.2rem;
          padding: 1rem 0;
          line-height: 1.5em;
          color: ${(props) => props.theme.gray2};
        }
      }
    }
  }

  & > .footer {
    min-height: 400px;
    position: relative;
    background-color: ${(props) => props.theme.onBackground};
    margin-top: 120px;
    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: top;
    }
    & > div {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      flex-direction: column;
      z-index: 2;
      width: 100%;
      p {
        line-height: 1.1em;
        font-size: 4em;
        font-weight: 350;
        margin-bottom: var(--padding-6);
        text-align: center;
      }
    }
  }

  ${breakpoint("sm")} {
    header {
      img {
        object-position: center;
      }
      h2 {
        margin-bottom: 5rem;
      }
      div {
        padding: 0 20px;
        bottom: 14%;
        flex-direction: row;
        p {
          margin-left: 15vw;
          margin-top: 5rem;
        }
      }
    }
    section {
      flex-direction: row;
      &:not(:last-of-type) {
      }

      &.block-right {
        flex-direction: row-reverse;

        img {
          margin-left: auto;
        }
      }
      .image-container {
        max-width: 50vw;
        display: flex;
        align-items: start;
      }
      img {
        width: 75%;
        height: auto;
      }
    }
    article {
      /* padding: 0 10vw; */
      margin-top: 0;

      & > div {
        grid-template-columns: 1fr 1fr;
        gap: 5rem;
      }
    }
    & > div:not(:last-of-type) {
      padding: 0 10vw;
      flex-direction: row;
      margin-top: 5rem;

      & > div:nth-of-type(2) {
        height: 0;
        width: 5rem;
      }

      & > div:last-of-type {
        margin-top: 0;
        /* margin-left:5rem; */
      }
    }
  }
  ${breakpoint("md")} {
    header > div {
      right: 10%;
    }
  }
`;
