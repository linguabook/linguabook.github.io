import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import cx from "classnames";
import { SearchInput, useSearchState } from "./SearchInput";
import "./icons";
import Card from "./DataCard";
import Empty from "./Empty";

import styles from "./App.module.scss";
import useSourceMenu from "./use-source-menu";
import { useDesktop } from "./hooks";

type Props = {
  className?: string;
  style?: any;
  dark?: boolean;
};

const App: React.FC<Props> = ({ className, style, dark }) => {
  const sourceMenu = useSourceMenu();
  const search = useSearchState();
  const desktop = useDesktop();
  return (
    <ChakraProvider>
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
              reset={search.reset}
              placeholder="Type a word..."
              dark={dark}
            />
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
            <Empty />
          )}
        </main>
      </div>
    </ChakraProvider>
  );
};

export default App;
