import React from "react";
import {
  Box,
  Icon,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { MdSearch } from "react-icons/md";
import { useDebounce } from "use-debounce";

import useState from "./use-search-state";

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
};

export const StatelessSearchInput: React.FC<Props> = ({
  value,
  onChange,
  reset,
  placeholder = "Search...",
}) => {
  return (
    <Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={MdSearch} />
        </InputLeftElement>
        <Input value={value} onChange={onChange} placeholder={placeholder} />
        {value ? (
          <InputRightElement cursor="pointer" onClick={reset}>
            <Icon as={CloseIcon} />
          </InputRightElement>
        ) : null}
      </InputGroup>
    </Box>
  );
};

export const SearchInput: React.FC<{}> = () => {
  const state = useSearchState();
  return (
    <StatelessSearchInput
      value={state.text}
      onChange={state.onChange}
      reset={state.resetText}
      placeholder="Type a word..."
    />
  );
};
