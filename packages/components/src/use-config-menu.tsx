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
import { atom, useRecoilState } from "recoil";
import { WordList } from "./internal-types";
import { CustomWordList } from "./CustomWordList";

const WORD_LISTS = {
  ogden: {
    name: "ogden",
    ...ogden,
  },
  dolch: {
    name: "dolch",
    ...dolch,
  },
  mylist: CustomWordList.instance,
};

const ConfigAtom = atom({
  key: "app-config",
  default: {
    excludedSources: [] as string[],
    activeList: "ogden",
  },
});

export default function useConfigState() {
  const [state, setState] = useRecoilState(ConfigAtom);

  const activeList = state.activeList;
  const wordList = useMemo<WordList>(() => WORD_LISTS[activeList], [
    activeList,
  ]);

  const setActiveList = (value: string) => {
    setState({
      ...state,
      activeList: value,
    });
  };

  const setExclude = (value: string[]) => {
    setState({
      ...state,
      excludedSources: value,
    });
  };

  return {
    exclude: state.excludedSources,
    wordList,
    setExclude,
    activeList,
    setActiveList,
  };
}

export const ConfigMenu: React.FC<{}> = () => {
  const { exclude, setExclude, activeList, setActiveList } = useConfigState();
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

  return (
    <Menu>
      <MenuButton as={IconButton}>
        <Icon as={MdSettings} />
      </MenuButton>
      <MenuList zIndex={11}>
        <MenuOptionGroup
          defaultValue="asc"
          title="Word List"
          type="radio"
          value={activeList}
          onChange={(value: any) => {
            setActiveList(value);
          }}
        >
          <MenuItemOption value="mylist">My Word List</MenuItemOption>
          <MenuItemOption value="ogden">Ogden Basic English</MenuItemOption>
          <MenuItemOption value="dolch">Dolch Sight Words</MenuItemOption>
        </MenuOptionGroup>
        <MenuGroup title="Sources">{sourceItems}</MenuGroup>
      </MenuList>
    </Menu>
  );
};
