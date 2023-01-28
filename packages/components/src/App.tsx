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
import Analytics from "react-router-ga";
import { RecoilRoot } from "recoil";
import cx from "clsx";

import { SearchInput, useSearchState } from "./SearchInput";
import Card from "./DataCard";
import WordList from "./WordList";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import useConfigMenu, { ConfigMenu } from "./use-config-menu";
import Feed from "./Feed";
import useKnownWords from "./use-known-words";

type Props = {
  className?: string;
  style?: any;
};

const App: React.FC<Props> = ({ className, style }) => {
  const search = useSearchState();
  const config = useConfigMenu();
  return (
    <VStack className={cx(className)} style={style} pos="relative">
      <TopBar />
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
      <Box flexGrow={0} flexShrink={0}>
        <ConfigMenu />
      </Box>
      <Box flexGrow={1} flexShrink={1}>
        <SearchInput />
      </Box>
      <Box flexGrow={0} flexShrink={0}>
        <Badge
          fontFamily="monospace"
          fontSize="md"
          variant="solid"
          rounded="full"
          title="Number of known words"
          px={2}
        >
          {words.size}
        </Badge>
      </Box>
      <Box flexGrow={0} flexShrink={0}>
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
          <Analytics id="G-SHK7Q8TMPJ" debug>
            <App {...props} />
          </Analytics>
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default AppContainer;
