import { keyframes } from "@emotion/react";

export const spinner = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg);}
  100% {transform: translate(-50%, -50%) rotate(360deg)}
`;

export const verification = keyframes`
  from {transform: rotateY(0) translateY(110%)}
  40% {transform: rotateY(360deg) translateY(-100px)}
  90% {transform: rotateY(720deg) translateY(50px)}
  to {transform:translateY(0)}
`;

export const spinner2 = keyframes`
  0% { transform: rotate(0deg);}
  100% {transform: rotate(360deg)}
`;

export const scroll = keyframes`
99% {transform: translate3d(100%,0,0); opacity:1},
100%{opacity:0;}
`;
export const scroll2 = keyframes`
/* 0% {transform: translateX(-100%)}, */
0%{transform:translateX(0%)},
100% {transform: translateX(100%)}
`;

export const sliding = keyframes`
0%{transform:translateX(-100%)},
100% {transform: translateX(0%)}
`;

export const blink = keyframes`
0%{opacity:1},
100%{opacity:0.6}
`;
