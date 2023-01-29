import { Icon, IconButton } from "@chakra-ui/react";
import { BiShareAlt as ShareIcon } from "@react-icons/all-files/bi/BiShareAlt";
import {
  BsBookmark as BookmarkIcon
} from "@react-icons/all-files/bs/BsBookmark";
import {
  BsThreeDots as DotsIcon
} from "@react-icons/all-files/bs/BsThreeDots";
import { FaBrain as IgnoreIcon } from "@react-icons/all-files/fa/FaBrain";
import {
  FiChevronDown as ChevronDownIcon
} from "@react-icons/all-files/fi/FiChevronDown";
import {
  FiChevronsDown as ChevronsDownIcon
} from "@react-icons/all-files/fi/FiChevronsDown";
import {
  FiChevronsUp as ChevronsUpIcon
} from "@react-icons/all-files/fi/FiChevronsUp";
import {
  FiChevronUp as ChevronUpIcon
} from "@react-icons/all-files/fi/FiChevronUp";

import { IoIosHeartEmpty as HeartIcon } from "@react-icons/all-files/io/IoIosHeartEmpty";
import React from "react";
import { useMyWords } from "./CustomWordList";
import useKnownWords from "./use-known-words";

export const ShowMore: React.FC<any> = ({ showMore, setShowMore }) => {
  const handleClick = () => setShowMore(!showMore);
  const title = showMore ? "Show less" : "Show more";
  return (
    <IconButton
      icon={<Icon as={showMore ? ChevronsUpIcon : ChevronsDownIcon} />}
      title={title}
      aria-label={title}
      onClick={handleClick}
    />
  );
};

export const ToggleIcon: React.FC<any> = ({ expanded, setExpanded }) => {
  const toggle = () => setExpanded(!expanded);
  return (
    <Icon
      as={expanded ? ChevronUpIcon : ChevronDownIcon}
      onClick={toggle}
      cursor="pointer"
    />
  );
};

export const ToggleButton: React.FC<any> = ({
  expanded,
  setExpanded,
  dots,
}) => {
  const toggle = () => setExpanded(!expanded);
  const title = expanded ? "Collapse this section" : "Expand this section";
  const icon = dots ? DotsIcon : expanded ? ChevronUpIcon : ChevronDownIcon;
  return (
    <IconButton
      icon={<Icon as={icon} />}
      title={title}
      aria-label={title}
      onClick={toggle}
      p={dots ? 0 : undefined}
      w={dots ? "auto" : undefined}
      h={dots ? "auto" : undefined}
    />
  );
};

export const KnowButton: React.FC<{ text: string }> = ({ text }) => {
  const knownWords = useKnownWords();
  const title = "I know this phrase";
  return (
    <IconButton
      icon={<Icon as={IgnoreIcon} />}
      title={title}
      aria-label={title}
      onClick={() => {
        knownWords.add(text);
      }}
    />
  );
};

export const BookmarkButton: React.FC<{ text: string }> = ({ text }) => {
  const words = useMyWords();
  const title = "Add to my list";
  return (
    <IconButton
      icon={<Icon as={BookmarkIcon} />}
      title={title}
      aria-label={title}
      onClick={() => {
        words.add(text);
      }}
    />
  );
};

export const LikeButton: React.FC<{}> = () => {
  const title = "I like this phrase";
  return (
    <IconButton
      icon={<Icon as={HeartIcon} />}
      title={title}
      aria-label={title}
    />
  );
};

export const ShareButton: React.FC<{}> = () => {
  const title = "Share this phrase";
  return (
    <IconButton
      icon={<Icon as={ShareIcon} />}
      title={title}
      aria-label={title}
    />
  );
};
