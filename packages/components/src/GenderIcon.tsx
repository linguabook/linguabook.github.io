import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
  gender: string;
  size?: SizeProp;
};

const GenderIcon: React.FC<Props> = ({ gender, size }) => {
  if (!gender) {
    return null;
  }
  return <Icon icon={gender === "f" ? "female" : "male"} size={size} />;
};

export default GenderIcon;
