import React from "react";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";

const SelectStub: React.FC<any> = () => <div />;
const SelectImpl =
  typeof window === "undefined" ? SelectStub : require("react-select").default;

function isOption(value: any) {
  return isPlainObject(value) && value.label;
}

function normalizeValue(value: any) {
  if (Array.isArray(value)) {
    return value.map((t) => (isOption(t) ? t.value : t));
  }
  return isOption(value) ? value.value : value;
}

type Option = {
  value: any;
  label: string;
};

export type SelectProps = {
  id?: string;
  name?: string;
  className?: string;
  style?: any;
  value: any;
  isMulti?: boolean;
  placeholder?: string;
  onChange: (e: any) => void;
  isClearable?: boolean;
};

export type SelectImplProps = SelectProps & {
  options: Option[];
  optionMap: Map<any, Option>;
};

export const Select: React.FC<SelectImplProps> = ({
  id,
  name,
  className,
  style,
  value,
  isMulti,
  placeholder,
  onChange,
  options,
  optionMap,
  isClearable = true,
}) => {
  if (isString(value) && value) {
    let option = optionMap.get(value);
    if (!option) {
      option = { value, label: value };
    }
    value = [option];
  } else if (Array.isArray(value) && value.length > 0) {
    value = value
      .filter((t) => (isString(t) ? !!t : !!t.value))
      .map((t) => (isString(t) ? { value: t, label: t } : t));
    if (value.length === 0) {
      value = undefined;
    }
  } else {
    value = undefined;
  }

  const handleChange = (option: any) => {
    onChange({ value: isMulti ? normalizeValue(option || []) : option.value });
  };

  return (
    <SelectImpl
      id={id}
      name={name}
      className={className}
      styles={style}
      value={value}
      options={options}
      isMulti={isMulti}
      onChange={handleChange}
      isClearable={isClearable}
      placeholder={placeholder}
    />
  );
};
