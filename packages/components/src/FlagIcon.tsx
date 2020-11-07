import React from "react";
import { countries } from "country-code-lookup";
import { flags } from "./flags";

import styles from "./FlagIcon.module.scss";

const countryMap = new Map<string, string>(
  countries.map((c) => [c.country.toLowerCase(), c.iso2.toLowerCase()])
);

type Props = {
  country: string;
};

const FlagIcon: React.FC<Props> = ({ country }) => {
  const code = countryMap.get(country);
  if (!code) {
    return null;
  }
  const Flag = flags[code];
  if (!Flag) {
    return null;
  }
  return (
    <span className={styles.container}>
      <Flag width="1.5em" height="1.5em" />
    </span>
  );
};

export default FlagIcon;
