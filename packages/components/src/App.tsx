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
import { SearchInput, useSearchState } from "./SearchInput";
import Card from "./DataCard";
import WordList from "./WordList";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import useSourceMenu from "./use-source-menu";
import Feed from "./Feed";
import styles from "./App.module.scss";

type Props = {
  className?: string;
  style?: any;
};

const App: React.FC<Props> = ({ className, style }) => {
  const sourceMenu = useSourceMenu();
  const search = useSearchState();
  const { colorMode } = useColorMode();
  const dark = colorMode === "dark";
  return (
    <VStack className={className} style={style}>
      <HStack spacing={2} mt={1}>
        <Box>{sourceMenu.view}</Box>
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
      <main>
        {search.debouncedText ? (
          <Card
            text={search.debouncedText}
            lang="en"
            exclude={sourceMenu.exclude}
            dark={dark}
          />
        ) : (
          <Feed dark={dark} exclude={sourceMenu.exclude} />
        )}
      </main>
    </VStack>
  );
};

const WordsPage = () => (
  <Box margin="0 20px" marginBottom="20px">
    <p>
      Below is a list of <a href="http://basic-english.org/">Basic English</a>{" "}
      words you can use as a good learning start.
    </p>
    <WordList />
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
