import React from "react";
import { Icon } from "@chakra-ui/react";
import { FaFemale, FaMale } from "react-icons/fa";

type Props = {
  gender: string;
  size?: string | number;
};

const GenderIcon: React.FC<Props> = ({ gender, size }) => {
  if (!gender) {
    return null;
  }
  return <Icon as={gender === "f" ? FaFemale : FaMale} size={size} />;
};

export default GenderIcon;
