import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Settings";
import { sources } from "lingua-scraper";

export default function useSourceMenu() {
  const [exclude, setExclude] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const items = sources.map((source, i) => (
    <MenuItem key={i} onClick={handleClose}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!exclude.includes(source.name)}
            onChange={(e) => {
              if (e.target.checked) {
                setExclude(exclude.filter((s) => s !== source.name));
              } else {
                setExclude(exclude.concat([source.name]));
              }
            }}
            name={source.name}
            color="primary"
          />
        }
        label={source.name}
      />
    </MenuItem>
  ));

  const view = (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        aria-controls="excluded-sources-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="excluded-sources-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {items}
      </Menu>
    </>
  );

  return { exclude, view };
}
