import React from "react";
import {
  ChakraProvider,
  Box,
  theme,
  useColorMode,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import cx from "clsx";

import { SearchInput, useSearchState } from "./SearchInput";
import Card from "./DataCard";
import WordList from "./WordList";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import useConfigMenu from "./use-config-menu";
import Feed from "./Feed";
import styles from "./App.module.scss";
import { AppCloseButton } from "./buttons";

type Props = {
  className?: string;
  style?: any;
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const App: React.FC<Props> = ({ className, style }) => {
  const isEmbedded = inIframe();
  const config = useConfigMenu();
  const search = useSearchState();
  const { colorMode } = useColorMode();
  const dark = colorMode === "dark";
  return (
    <VStack className={cx(className, styles.app)} style={style}>
      {isEmbedded ? (
        <Box zIndex={999}>
          <AppCloseButton />
        </Box>
      ) : null}
      {isEmbedded ? null : (
        <HStack spacing={2} mt={1}>
          <Box>{config.view}</Box>
          <Box className={styles.item}>
            <SearchInput
              value={search.text}
              onChange={search.onChange}
              reset={search.resetText}
              placeholder="Type a word..."
            />
          </Box>
          <Box>
            <ColorModeSwitcher />
          </Box>
        </HStack>
      )}
      <main>
        {search.debouncedText ? (
          <Card
            text={search.debouncedText}
            lang="en"
            exclude={config.exclude}
            dark={dark}
          />
        ) : (
          <Feed
            dark={dark}
            exclude={config.exclude}
            wordList={config.wordList}
          />
        )}
      </main>
    </VStack>
  );
};

const WordsPage = ({ wordList }) => (
  <Box margin="0 20px" marginBottom="20px">
    <p>
      Below is a list of <a href="http://basic-english.org/">Basic English</a>{" "}
      words you can use as a good learning start.
    </p>
    <WordList wordList={wordList} />
  </Box>
);

const AppContainer: React.FC<Props> = (props) => {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Router>
          <App {...props} />
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default AppContainer;
