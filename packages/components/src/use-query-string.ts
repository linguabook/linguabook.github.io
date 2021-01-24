import { useLocation, useHistory } from "react-router-dom";
import qs from "query-string";

export default function useQueryString() {
  const location = useLocation();
  const query = qs.parse(location.search);
  const history = useHistory();

  const setParam = (key: string, value: string) => {
    history.push({
      pathname: location.pathname,
      search: qs.stringify({
        ...query,
        [key]: value || undefined,
      }),
    });
  };

  return {
    query,
    setParam,
  };
}
