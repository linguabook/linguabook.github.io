import useQueryString from "./use-query-string";

export const PARAM_NAME = "search-string";

export default function useSearchState() {
  const { query, setParam } = useQueryString();
  const val = query[PARAM_NAME];
  const text = (Array.isArray(val) ? val[0] : val) || "";

  const setText = (value: string) => {
    setParam(PARAM_NAME, value);
  };

  const onChange = (e: any) => {
    setText(e.target.value);
  };

  return {
    text,
    onChange,
    resetText: () => setText(""),
  };
}
