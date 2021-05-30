import _ from "lodash";
import React, { useState } from "react";
import {
  Tab,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Heading,
  Table,
} from "@chakra-ui/react";
import { fetchData } from "lingua-scraper";
import useSWR from "swr";

import cx from "clsx";
import qs from "query-string";

import Error from "./ErrorCard";
import Loader from "./Loader";
import Empty from "./Empty";
import Slide from "./Slide";

import styles from "./DataCard.module.scss";
import { useDesktop } from "./hooks";

import SwiperCore, { Navigation, A11y, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import { ShowMore, KnowButton, BookmarkButton, ToggleIcon } from "./buttons";
import Card from "./Card";
import useConfigState from "./use-config-menu";
import { useDarkMode } from "./use-dark-mode";
import { Playlist, TermList } from "./ItemList";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

const nonPlural = ["audio"];

function getLabel(key: string) {
  if (key === "in") {
    return "Examples";
  }
  if (key === "translated_as") {
    return "Translations";
  }
  if (nonPlural.indexOf(key) >= 0) {
    return _.capitalize(key);
  }
  return _.capitalize(key) + "s";
}

type Props = {
  text: string;
  lang: string;
};

type Tab = {
  key: string;
  label: string;
  content: any[];
};

const DataCard: React.FC<Props> = ({ text, lang }) => {
  const { exclude } = useConfigState();
  const q = qs.stringify({ exclude });

  const { data, error } = useSWR(`/words/data/${text}?${q}`, () =>
    fetchData({ text }, { exclude })
  );

  if (error) {
    return <Error error={error} />;
  }

  if (!data) {
    return (
      <Card textAlign="center">
        <Loader />
      </Card>
    );
  }

  return <StatelessCard text={text} lang={lang} data={data} />;
};

type StatelessCardProps = Props & {
  data: any;
};

export const StatelessCard: React.FC<StatelessCardProps> = ({
  text,
  lang,
  data: sources,
}) => {
  const dark = useDarkMode();
  const desktop = useDesktop();
  const [showMore, setShowMore] = useState(false);
  const slideWidth = desktop ? "512px" : "100vw";
  const slideHeight = desktop ? 512 / 2 + "px" : "calc(100vw/2)";

  const visual: any[] = [];
  const textData = {
    transcription: [] as string[],
    definition: [] as string[],
    tag: [] as string[],
  };
  const translations: { text: string; lang: string }[] = [];
  const audio: { source: any; url: string }[] = [];
  let tabs: Tab[] = [];

  const makeTab = (key) => {
    const lt = (a: string, b: string) => {
      const knownOrder = [
        "definition",
        "in",
        "translated_as",
        "synonym",
        "audio",
      ];
      const order = (s: string) => {
        const i = knownOrder.indexOf(s);
        return i >= 0 ? i : 1000;
      };
      const k1 = order(a);
      const k2 = order(b);
      return k1 != k2 ? _.lt(k1, k2) : _.lt(a, b);
    };
    let tab = tabs.find((t) => t.key === key);
    if (!tab) {
      tab = { key, label: getLabel(key), content: [] };
      for (let i = 0; i < tabs.length; i++) {
        if (lt(tab.key, tabs[i].key)) {
          tabs.splice(i, 0, tab);
          return tab;
        }
      }
      tabs.push(tab);
    }
    return tab;
  };

  // TODO convert data to more usable way to easy map it to react elements
  for (const sourceData of sources) {
    const source = sourceData.source;
    _.each(sourceData.data, (data, key) => {
      if (_.isEmpty(data)) {
        return;
      }
      if (textData[key]) {
        for (const item of data) {
          if (_.isArray(item)) {
            textData[key] = textData[key].concat(item);
          } else {
            textData[key].push(item);
          }
        }
        textData[key] = _.uniq(textData[key]);
      }
      if (key === "visual") {
        const target = visual;
        for (const item of data) {
          target.push({
            source,
            ...(_.isString(item) ? { url: item } : item),
          });
        }
      } else if (key === "audio") {
        const tab = makeTab(key);
        const audioData = data.map((item) => ({
          source,
          ...(_.isString(item) ? { url: item } : item),
        }));
        audio.push(...audioData);
        tab.content.push(
          <Playlist
            key={`${source.name}-${key}`}
            source={source}
            items={audioData}
          />
        );
      } else {
        const term = key.split("@");
        const name = term[0];
        const tab = makeTab(name);
        const items = data.map((item) => ({
          source,
          text: item,
          lang: term[1] || lang,
        }));

        if (name === "translated_as") {
          translations.push(...items);
        }

        tab.content.push(
          <TermList
            key={`${source.name}-${key}`}
            source={source}
            items={items}
          />
        );
      }
    });
  }

  const slides = visual.map((d, i) => (
    <SwiperSlide
      key={i}
      style={{
        width: slideWidth,
        height: slideHeight,
      }}
    >
      <Slide
        src={d.url}
        text={{ text, lang }}
        transcription={textData.transcription[0]}
        audio={_.head(audio)}
        translations={translations.filter((t) => t.lang === "ru")}
      />
    </SwiperSlide>
  ));

  if (_.isEmpty(visual) && _.isEmpty(tabs)) {
    return <Empty />;
  }

  return (
    <Card
      className={cx(styles.card, {
        [styles.desktop]: desktop,
        [styles.mobile]: !desktop,
        [styles.dark]: dark,
      })}
      borderWidth={1}
      borderColor="gray.300"
    >
      <VStack spacing={0}>
        {_.isEmpty(visual) ? null : (
          <div className={styles.visual}>
            <Swiper
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              style={{
                width: slideWidth,
              }}
            >
              {slides}
            </Swiper>
          </div>
        )}
        {textData.definition[0] ? (
          <Box p={5}>
            <Text>{textData.definition[0]}</Text>
          </Box>
        ) : null}
        <ToolBar
          showMore={showMore}
          setShowMore={setShowMore}
          text={text}
          tags={textData.tag}
        />
        {showMore ? (
          <Box w="100%" textAlign="left" px={2}>
            {tabs.map((t) => (
              <Section key={t.key} label={t.label} content={t.content} />
            ))}
          </Box>
        ) : null}
      </VStack>
    </Card>
  );
};

const Section: React.FC<any> = ({ label, content }) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(!expanded);
  return (
    <Box w="100%">
      <Heading
        size="md"
        onClick={toggle}
        cursor="pointer"
        borderBottom="1px solid gray"
        borderBottomColor="gray.100"
        w="100%"
        py={1}
      >
        <ToggleIcon expanded={expanded} setExpanded={setExpanded} />
        {label}
      </Heading>
      {expanded ? (
        <Box py={1}>
          <Table>
            <tbody>{content}</tbody>
          </Table>
        </Box>
      ) : null}
    </Box>
  );
};

// TODO improve toolbar
const ToolBar: React.FC<any> = ({
  showMore,
  setShowMore,
  text,
  tags: inputTags,
}) => {
  const tags: string[] = _.take(
    _.isEmpty(inputTags) ? ["UNKNOWN"] : inputTags,
    3
  );
  return (
    <HStack py={2} px={5} justify="space-between" overflow="hidden">
      <Box flex="0 0">
        <ShowMore showMore={showMore} setShowMore={setShowMore} />
      </Box>
      <HStack flex="1 1" overflow="hidden">
        {_.take(tags, 3).map((tag, key) => (
          <Badge
            key={key}
            variant="solid"
            rounded="full"
            px={2}
            overflow="hidden"
            fontFamily="monospace"
            fontSize="sm"
            title={tag}
            textOverflow="ellipsis"
          >
            {tag}
          </Badge>
        ))}
      </HStack>
      <HStack flex="0 0">
        <KnowButton text={text} />
        <BookmarkButton text={text} />
      </HStack>
    </HStack>
  );
};

export default DataCard;
