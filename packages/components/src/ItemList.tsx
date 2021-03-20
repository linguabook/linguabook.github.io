import React, { useState } from "react";
import { Source } from "lingua-scraper/dist/types";
import {
  Heading,
  ListItem,
  HStack,
  UnorderedList,
  Text,
} from "@chakra-ui/react";
import styles from "./DataCard.module.scss";
import _ from "lodash";
import { ToggleButton } from "./buttons";
import SoundIcon from "./SoundIcon";
import GenderIcon from "./GenderIcon";
import FlagIcon from "./FlagIcon";

const SourceLink: React.FC<{ source: Source }> = ({ source }) => (
  <a href={source.url}>{source.name}</a>
);

const ListHeading: React.FC<{ children: any }> = ({ children }) => (
  <Heading
    size="lg"
    letterSpacing="wide"
    className={styles.source_header}
    fontWeight="bold"
  >
    {children}
  </Heading>
);

const TextItem: React.FC<any> = ({ item }) => <ListItem>{item.text}</ListItem>;

const ItemList: React.FC<any> = ({ source, items, ItemView = TextItem }) => {
  if (_.isEmpty(items)) {
    return null;
  }
  const [expanded, setExpanded] = useState(false);
  const nodes = (expanded ? items : _.take(items, 3)).map((rec, i) => {
    return <ItemView key={i} item={rec} />;
  });
  return (
    <tr>
      <td>
        <HStack justify="space-between">
          <ListHeading>
            <SourceLink source={source} />
          </ListHeading>
          <ToggleButton expanded={expanded} setExpanded={setExpanded} />
        </HStack>
        <UnorderedList pl={1}>{nodes}</UnorderedList>
      </td>
    </tr>
  );
};

const AudioItem: React.FC<any> = ({ item }) => {
  return (
    <ListItem>
      <SoundIcon url={item.url} />
      <Text>{item.author || "unknown"}</Text>
      <span className={styles.ml}>
        <GenderIcon gender={item.gender} />
      </span>
      <span className={styles.ml}>
        <FlagIcon country={item.country} />
      </span>
    </ListItem>
  );
};

export const Playlist: React.FC<any> = ({ source, items }) => (
  <ItemList source={source} items={items} ItemView={AudioItem} />
);

export const TermList: React.FC<any> = ({ source, items }) => (
  <ItemList source={source} items={items} />
);
