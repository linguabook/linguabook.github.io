import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

const Theme = atom({
  key: "theme",
  default: "light",
});

export default function useTheme() {
  const [theme, setTheme] = useRecoilState(Theme);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");

    if (localTheme) {
      setTheme(localTheme);
    } else {
      window.localStorage.setItem("theme", "light");
    }
  }, [setTheme]);

  return [theme, toggleTheme];
}
