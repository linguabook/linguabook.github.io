import {
  Badge, Box, ChakraProvider, HStack, theme,
  VStack
} from "@chakra-ui/react";
import cx from "clsx";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Card from "./DataCard";
import Feed from "./Feed";
import GATracking from "./GATracking";
import { SearchInput, useSearchState } from "./SearchInput";
import useConfigMenu, { ConfigMenu } from "./use-config-menu";
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

const AppContainer: React.FC<Props> = (props) => {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Router>
          <GATracking>
            <App {...props} />
          </GATracking>
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default AppContainer;
