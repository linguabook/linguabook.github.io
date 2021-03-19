import React from "react";
import { Text } from "@chakra-ui/react";
import Card from "./Card";

type Props = {
  error: any;
};

const ErrorCard: React.FC<Props> = ({ error }) => (
  <Card>
    <Text color="red">Oops!</Text>
  </Card>
);

export default ErrorCard;
