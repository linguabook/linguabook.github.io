import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
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
      <MenuButton>
        <SettingsIcon />
      </MenuButton>
      <MenuList>{items}</MenuList>
    </Menu>
  );

  return { exclude, view };
}
