import { useColorMode } from "@chakra-ui/react";

export function useDarkMode() {
  const { colorMode } = useColorMode();
  return colorMode === "dark";
}
