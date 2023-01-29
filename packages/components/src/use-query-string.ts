import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";

export default function useQueryString() {
  const location = useLocation();
  const query = qs.parse(location.search);
  const navigate = useNavigate();

  const setParam = (key: string, value: string) => {
    navigate({
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
