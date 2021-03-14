import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { sources } from "lingua-scraper";

export default function useSourceMenu() {
  const [exclude, setExclude] = useState<string[]>([]);

  const items = sources.map((source, i) => (
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
      <MenuList>{items}</MenuList>
    </Menu>
  );

  return { exclude, view };
}
