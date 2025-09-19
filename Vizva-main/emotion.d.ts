import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    mode: string;

    primary: string;
    secondary: string;
    background: string; // change to background
    onBackground: string;
    backdrop: string;

    green: string;
    orange: string;
    pink: string;

    white: string;
    black: string;

    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;

    gradient: string;
    formBackground: string;
  }
}
