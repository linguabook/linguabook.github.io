import React from "react";
import { Icon } from "@chakra-ui/react";
import { FaVolumeUp } from "react-icons/fa";

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
      <Icon as={FaVolumeUp} />
    </span>
  );
};

export default SoundIcon;
