import React, { useState } from "react";
import cx from "classnames";
import { SearchInput, useSearchState } from "./SearchInput";
import "./icons";
import Card from "./DataCard";
import Empty from "./Empty";

import styles from "./App.module.scss";
import SourceSelect from "./SourceSelect";
import { useDesktop } from "./hooks";

type Props = {
  className?: string;
  style?: any;
};

const App: React.FC<Props> = ({ className, style }) => {
  const [exclude, setExclude] = useState([]);
  const search = useSearchState();
  const desktop = useDesktop();
  return (
    <div
      className={cx(styles.app, className, { [styles.desktop]: desktop })}
      style={style}
    >
      <header>
        <div className={styles.item}>
          <div className={styles.source_select_container}>
            <SourceSelect
              className={styles.source_select}
              value={exclude}
              onChange={(e) => setExclude(e.value)}
              placeholder="Exclude sources..."
            />
          </div>
        </div>
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
          <Card text={search.debouncedText} exclude={exclude} />
        ) : (
          <Empty />
        )}
      </main>
    </div>
  );
};

export default App;
