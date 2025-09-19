import styled from "@emotion/styled";
import moment from "moment";
import { breakpoint } from "public/breakpoint";
import React, { useEffect, useState } from "react";
import { stringToTime } from "services/helpers";

interface CountDownProps {
  time: any;
  position?: string;
  page?: string;
}

export default function CountDown(props: CountDownProps) {
  const { time, position = "absolute", page } = props;
  const [t, setT] = useState("0h : 0m : 0s");
  let TIME = time.iso ? new Date(time.iso).getTime() : new Date(time).getTime();

  useEffect(() => {
    function countDown(): void {
      const today = new Date().getTime();

      const space = (TIME as unknown as number) - today;
      if (space < 0) {
        setT(`Auction ended`);
        return clearInterval(interval);
      }

      // const dayTime = Math.floor(space / (1000 * 60 * 60 * 24));
      const secondTime = Math.floor((space % (1000 * 60)) / 1000);
      const minuteTime = Math.floor((space % (1000 * 60 * 60)) / (1000 * 60));
      const daysTime = Math.floor(space / (1000 * 60 * 60 * 24));
      const hourTime = Math.floor(
        (space % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (!daysTime) {
        setT(`${hourTime}h : ${minuteTime}m : ${secondTime}s`);
      } else {
        setT(`${daysTime}d : ${hourTime}h : ${minuteTime}m`);
      }
    }
    // countDown();
    const interval = setInterval(countDown, 1000);
    return () => clearInterval(interval);
  }, []);

  return t !== "Auction ended" ? (
    <StyledDiv $position={position} $page={page} className="countdown-time">
      <p>{t} left</p>
    </StyledDiv>
  ) : (
    <></>
  );
}

// CountDown.defaultProps = {
//   position: "absolute",
// };

const StyledDiv = styled.div<{ $position?: string; $page?: string }>`
  display: flex;
  align-items: center;
  width: max-content;
  position: relative;
  padding: 0 1.4rem;
  background: ${(props) => props.theme.background};
  border: 2px solid 2px ${(props) => props.theme.background};

  position: ${(props) => props.$position};
  height: 50px;
  border-radius: 50px;
  justify-content: center;

  ${(props) =>
    props.$page === "artwork"
      ? {
          border: `solid 2px transparent`,
          backgroundClip: "padding-box",
        }
      : {
          border: `2px solid ${props.theme.background}`,
          zIndex: "5",
        }};

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    border-radius: inherit;
    background: ${(props) => props.theme.gradient};

    ${(props) =>
      props.$page === "artwork"
        ? {
            margin: "-2px",
          }
        : {
            margin: "0",
          }};
  }
  p {
    font-size: var(--fontsizes-1);
    ${(props) =>
      props.$page === "artwork"
        ? {
            background: props.theme.gradient,
            backgroundClip: "text",
            textFillColor: "transparent",
            fontWeight: "500",
          }
        : {
            color: props.theme.background,
          }};
  }
  ${breakpoint("3xl")} {
    font-size: var(--fontsizes-3);
  }
`;
