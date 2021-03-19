import React from "react";
import { Box, ChakraProps } from "@chakra-ui/react";

type Props = ChakraProps & {
  className?: string;
};

const Card: React.FC<Props> = ({ children, ...props }) => (
  <Box rounded="5px" overflow="hidden" boxShadow="sm" {...props}>
    {children}
  </Box>
);

export default Card;
