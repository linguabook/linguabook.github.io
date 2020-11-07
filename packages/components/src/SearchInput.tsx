import React, { useState } from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useDebounce } from "use-debounce";
import cx from "classnames";

import styles from "./SearchInput.module.scss";

export function useSearchState() {
  const [text, setText] = useState("apple");
  const [debouncedText] = useDebounce(text, 500);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return {
    text,
    debouncedText,
    onChange,
    reset() {
      setText("");
    },
  };
}

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset(): void;
  placeholder?: string;
  dark?: boolean;
};

export const SearchInput: React.FC<Props> = ({
  value,
  onChange,
  reset,
  placeholder = "Search...",
  dark,
}) => {
  return (
    <div className={cx(styles.container, { [styles.dark]: dark })}>
      <button className={styles.left}>
        <Icon icon="search" />
      </button>
      <input
        className={value ? styles.not_empty : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value ? (
        <button className={styles.right} onClick={reset}>
          <Icon icon="times" />
        </button>
      ) : null}
    </div>
  );
};
