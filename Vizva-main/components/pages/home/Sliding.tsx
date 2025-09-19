import styled from "@emotion/styled";
import { slidingElements } from "entities/sliding";
import { sliding } from "entities/keyframes";
import { breakpoint } from "public/breakpoint";

export default function Sliding() {
  return (
    <StyledMarquee>
      <div>
        <div className="slide-1">
          {slidingElements.map(({ text, emoji }, index) => {
            return (
              <div className="slideBox" key={index}>
                <StyledSlide>
                  <span className="text">{text}</span>
                  <div className="image">
                    <img alt={text} src={emoji.src} />
                  </div>
                </StyledSlide>
              </div>
            );
          })}
        </div>
        <div className="slide-2">
          {slidingElements.map(({ text, emoji }, index) => {
            return (
              <div className="slideBox" key={index}>
                <StyledSlide>
                  <span className="text">{text}</span>
                  <div className="image">
                    <img alt={text} src={emoji.src} />
                  </div>
                </StyledSlide>
              </div>
            );
          })}
        </div>
      </div>
    </StyledMarquee>
  );
}

const StyledSlide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  width: 100%;

  .text {
    font-size: var(--fontsizes-6);
    background-image: ${(props) => props.theme.gradient};
    background-clip: text;
    color: transparent;
    line-height: 1em;
    width: min-content;
  }

  .image {
    position: relative;
  }
  img {
    width: clamp(50px, 4vw + 1rem, 90px);
  }

  ${breakpoint("3xl")} {
    .text {
      font-size: var(--fontsizes-7);
    }
  }
`;

const StyledMarquee = styled.div`
  position: relative;
  min-width: 100vw;
  width: 100%;
  overflow: hidden;
  transform: rotate(-4deg);
  margin: 7rem 0 9rem 0;

  & > div {
    display: flex;
    width: 5760px;
    animation: ${sliding} 40s linear infinite;

    ${breakpoint("lg")} {
      animation-duration: 30s;
    }
  }

  & > div > .slide-2 {
    width: 5760px;
  }

  & > div > .slide-1,
  & > div > .slide-2 {
    position: relative;
    display: flex;

    .slideBox:nth-of-type(4n + 1) {
      .text {
        width: 130px;
      }
    }
  }

  .slideBox {
    width: clamp(300px, 25vw, 25vw);
  }

  ${breakpoint("3xl")} {
    & > div > .slide-1,
    & > div > .slide-2 {
      .slideBox:nth-of-type(4n + 1) {
        .text {
          width: 173px;
        }
      }
    }
  }
`;
