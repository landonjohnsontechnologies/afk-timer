import { createContext } from "react";

export type GlobalContent = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemeContext = createContext<GlobalContent>({
  theme: "light",
  setTheme: () => {},
});
