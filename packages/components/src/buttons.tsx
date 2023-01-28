import React from "react";
import { Box, Icon, IconButton } from "@chakra-ui/react";
import {
  FiChevronsUp as ChevronsUpIcon,
  FiChevronsDown as ChevronsDownIcon,
  FiChevronUp as ChevronUpIcon,
  FiChevronDown as ChevronDownIcon,
} from "react-icons/fi";
import { FaBrain as IgnoreIcon } from "react-icons/fa";
import {
  BsBookmark as BookmarkIcon,
  BsThreeDots as DotsIcon,
} from "react-icons/bs";
import { MdClose as CloseIcon } from "react-icons/md";
import { IoIosHeartEmpty as HeartIcon } from "react-icons/io";
import { BiShareAlt as ShareIcon } from "react-icons/bi";
import useKnownWords from "./use-known-words";
import { useMyWords } from "./CustomWordList";

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
