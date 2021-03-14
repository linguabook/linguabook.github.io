import React from "react";
import { Text } from "@chakra-ui/react";

type Props = {
  error: any;
};

const ErrorCard: React.FC<Props> = ({ error }) => {
  return <Text color="red">Oops!</Text>;
};

export default ErrorCard;
