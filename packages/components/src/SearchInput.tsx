import React from "react";
import { Icon } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
import { useDebounce } from "use-debounce";
import cx from "clsx";

import useState from "./use-search-state";
import styles from "./SearchInput.module.scss";

export function useSearchState() {
  const state = useState();
  const [debouncedText] = useDebounce(state.text, 500);

  return {
    ...state,
    debouncedText,
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
        <Icon as={MdSearch} />
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
