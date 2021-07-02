import type { AppProps } from "next/app";
import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../lib/context";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState("light");
  const themeMemo = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    setTheme(currentTheme as string);
    document.body.classList.add(currentTheme as string);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: themeMemo.theme, setTheme: themeMemo.setTheme }}
    >
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}
export default MyApp;
