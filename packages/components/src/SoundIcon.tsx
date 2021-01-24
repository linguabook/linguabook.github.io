import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

type Props = {
  url: string;
};

const SoundIcon: React.FC<Props> = ({ url }) => {
  const play = () => {
    const sound = new Audio(url);
    sound.play();
  };
  return (
    <span onClick={play} style={{ cursor: "pointer", marginRight: "10px" }}>
      <Icon icon="volume-up" />
    </span>
  );
};

export default SoundIcon;
