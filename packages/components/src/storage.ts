import _ from "lodash";

export function load(key: string, type: string = "object") {
  const s = localStorage.getItem(key);
  if (!s) {
    return undefined;
  }
  try {
    const val = JSON.parse(s);
    if (isTypeOf(val, type)) {
      return val;
    }
  } catch (err) {}
  localStorage.removeItem(key);
  return undefined;
}

export function save(key: string, state: any) {
  localStorage.setItem(key, JSON.stringify(state));
}

function isTypeOf(val: any, type: string) {
  switch (type) {
    case "object":
      return _.isPlainObject(val);
    case "array":
      return _.isArray(val);
    default:
      return false;
  }
}
