import React from "react";
import { sources } from "lingua-scraper";
import { Select, SelectProps } from "./Select";

const options = sources.map((t) => ({ value: t.name, label: t.name }));
const optionMap = new Map(options.map((t) => [t.value, t]));

const SourceSelect: React.FC<SelectProps> = (props) => {
  return (
    <Select
      isMulti
      placeholder="Sources..."
      {...props}
      options={options}
      optionMap={optionMap}
    />
  );
};

export default SourceSelect;
