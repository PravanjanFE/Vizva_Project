import { Global, ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "entities/theme";
import { createContext, useEffect, useState } from "react";
import { IconContext } from "react-icons/lib";

export const ThemeContext = createContext({
  theme: lightTheme,
  mode: "light",
  changeTheme: () => {},
});

export default function CustomThemeProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [theme, setTheme] = useState(lightTheme);
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setMode(theme ?? "light");
  }, []);


  useEffect(() => {
    setTheme(mode === "dark" ? darkTheme : lightTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", mode);
    }
  }, [mode]);

  const changeTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, changeTheme }}>
      <ThemeProvider theme={{ ...theme, mode }}>
        <IconContext.Provider value={{ color: theme.primary }}>
          <>
            <Global
              styles={{
                body: {
                  backgroundColor: theme.background,
                },
              }}
            />
            {children}
          </>
        </IconContext.Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
