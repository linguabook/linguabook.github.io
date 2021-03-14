import React from "react";
import {
  Box,
  Icon,
  IconButton,
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

export const SearchInput: React.FC<Props> = ({
  value,
  onChange,
  reset,
  placeholder = "Search...",
}) => {
  return (
    <Box>
      <InputGroup>
        <InputLeftElement>
          <IconButton aria-label={placeholder}>
            <Icon as={MdSearch} />
          </IconButton>
        </InputLeftElement>
        <Input value={value} onChange={onChange} placeholder={placeholder} />
        {value ? (
          <InputRightElement>
            <IconButton onClick={reset} aria-label="Reset search">
              <Icon as={CloseIcon} />
            </IconButton>
          </InputRightElement>
        ) : null}
      </InputGroup>
    </Box>
  );
};
