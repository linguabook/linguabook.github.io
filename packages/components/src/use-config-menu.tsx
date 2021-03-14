import { useMemo, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuOptionGroup,
  MenuItem,
  MenuItemOption,
  Checkbox,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { sources, ogden, dolch } from "lingua-scraper";
import { WordList } from "./internal-types";

const WORD_LISTS = {
  ogden,
  dolch,
};

export default function useConfigMenu() {
  const [exclude, setExclude] = useState<string[]>([]);
  const [activeList, setActiveList] = useState("ogden");
  const wordList = useMemo<WordList>(() => WORD_LISTS[activeList], [
    activeList,
  ]);

  const sourceItems = sources.map((source, i) => (
    <MenuItem key={i}>
      <Checkbox
        size="lg"
        defaultIsChecked={!exclude.includes(source.name)}
        iconSize="2rem"
        onChange={(e) => {
          if (e.target.checked) {
            setExclude(exclude.filter((s) => s !== source.name));
          } else {
            setExclude(exclude.concat([source.name]));
          }
        }}
        name={source.name}
      >
        {source.name}
      </Checkbox>
    </MenuItem>
  ));

  const view = (
    <Menu>
      <MenuButton as={IconButton}>
        <Icon as={MdSettings} />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          defaultValue="asc"
          title="Word List"
          type="radio"
          value={activeList}
          onChange={(value: any) => {
            setActiveList(value);
          }}
        >
          <MenuItemOption value="ogden">Ogden Basic English</MenuItemOption>
          <MenuItemOption value="dolch">Dolch Sight Words</MenuItemOption>
        </MenuOptionGroup>
        <MenuGroup title="Sources">{sourceItems}</MenuGroup>
      </MenuList>
    </Menu>
  );

  return { exclude, wordList, view };
}
