import { useMediaQuery } from "react-responsive";

export function useDesktop() {
  return useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
}
