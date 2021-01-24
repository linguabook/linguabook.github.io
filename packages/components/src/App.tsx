import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import cx from "clsx";
import { SearchInput, useSearchState } from "./SearchInput";
import "./icons";
import Card from "./DataCard";
import WordList from "./WordList";
import ThemeSwitch from "./ThemeSwitch";
import useTheme from "./use-theme";
import useSourceMenu from "./use-source-menu";
import { useDesktop } from "./hooks";
import styles from "./App.module.scss";

type Props = {
  className?: string;
  style?: any;
};

const App: React.FC<Props> = ({ className, style }) => {
  const sourceMenu = useSourceMenu();
  const search = useSearchState();
  const desktop = useDesktop();
  const [theme] = useTheme();
  const dark = theme === "dark";
  return (
    <div
      className={cx(styles.app, className, {
        [styles.desktop]: desktop,
        [styles.dark]: dark,
      })}
      style={style}
    >
      <header>
        <div className={cx(styles.item, styles.fixed)}>{sourceMenu.view}</div>
        <div className={styles.item}>
          <SearchInput
            value={search.text}
            onChange={search.onChange}
            reset={search.resetText}
            placeholder="Type a word..."
            dark={dark}
          />
        </div>
        <div className={styles.item}>
          <div style={{ marginLeft: 10 }}>
            <ThemeSwitch />
          </div>
        </div>
      </header>
      <main>
        {search.debouncedText ? (
          <Card
            text={search.debouncedText}
            lang="en"
            exclude={sourceMenu.exclude}
            dark={dark}
          />
        ) : (
          <Box margin="0 20px">
            <p>
              Below is a list of{" "}
              <a href="http://basic-english.org/">Basic English</a> words you
              can use as a good learning start.
            </p>
            <WordList />
          </Box>
        )}
      </main>
    </div>
  );
};

const AppContainer: React.FC<Props> = (props) => {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Router>
          <App {...props} />
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default AppContainer;
