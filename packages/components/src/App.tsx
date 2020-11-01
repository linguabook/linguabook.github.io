import React, { useState } from "react";
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
};

const App: React.FC<Props> = ({ className, style }) => {
  const sourceMenu = useSourceMenu();
  const search = useSearchState();
  const desktop = useDesktop();
  return (
    <div
      className={cx(styles.app, className, { [styles.desktop]: desktop })}
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
          />
        </div>
      </header>
      <main>
        {search.debouncedText ? (
          <Card text={search.debouncedText} exclude={sourceMenu.exclude} />
        ) : (
          <Empty />
        )}
      </main>
    </div>
  );
};

export default App;
