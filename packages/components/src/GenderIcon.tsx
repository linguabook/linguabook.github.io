import { Icon } from "@chakra-ui/react";
import { FaFemale } from "@react-icons/all-files/fa/FaFemale";
import { FaMale } from "@react-icons/all-files/fa/FaMale";
import React from "react";

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
