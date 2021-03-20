import React from "react";
import {
  ChakraProvider,
  Box,
  theme,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import cx from "clsx";

import { SearchInput, useSearchState } from "./SearchInput";
import Card from "./DataCard";
import WordList from "./WordList";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import useConfigMenu, { ConfigMenu } from "./use-config-menu";
import Feed from "./Feed";
import { AppCloseButton } from "./buttons";
import styles from "./App.module.scss";
import useKnownWords from "./use-known-words";

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
  const search = useSearchState();
  const config = useConfigMenu();
  return (
    <VStack className={cx(className, styles.app)} style={style}>
      {isEmbedded ? (
        <Box zIndex={999}>
          <AppCloseButton />
        </Box>
      ) : null}
      {isEmbedded ? null : <TopBar />}
      <main>
        {search.debouncedText ? (
          <Card text={search.debouncedText} lang="en" />
        ) : (
          <Feed wordList={config.wordList} />
        )}
      </main>
    </VStack>
  );
};

const TopBar: React.FC<{}> = () => {
  const words = useKnownWords();
  return (
    <HStack spacing={2} mt={1}>
      <Box>
        <ConfigMenu />
      </Box>
      <Box className={styles.item}>
        <SearchInput />
      </Box>
      <Box>
        <Badge
          bgColor="blue.400"
          textColor="white"
          rounded="full"
          fontSize="sm"
          fontWeight="bold"
          minWidth="20px"
          minHeight="20px"
          textAlign="center"
          title="Number of known words"
        >
          {words.size}
        </Badge>
      </Box>
      <Box>
        <ColorModeSwitcher />
      </Box>
    </HStack>
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
