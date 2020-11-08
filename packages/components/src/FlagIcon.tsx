import React from "react";
import { countries } from "country-code-lookup";
import { flags } from "./flags";

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
  return <Flag width="1.5em" height="1.5em" />;
};

export default FlagIcon;
