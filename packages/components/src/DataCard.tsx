import _ from "lodash";
import React, { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
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
import { ShowMore, KnowButton, BookmarkButton } from "./buttons";
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
  const dark = useDarkMode();
  const { exclude } = useConfigState();
  const desktop = useDesktop();
  const [showMore, setShowMore] = useState(false);
  const slideWidth = desktop ? "512px" : "100vw";
  const slideHeight = desktop ? 512 / 2 + "px" : "calc(100vw/2)";

  const q = qs.stringify({ exclude });

  const { data: sources, error } = useSWR(`/words/data/${text}?${q}`, () => {
    return fetchData({ text }, { exclude });
  });

  if (error) {
    return <Error error={error} />;
  }

  if (!sources) {
    return (
      <Card textAlign="center">
        <Loader />
      </Card>
    );
  }

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
      const kind = (s: string) => {
        switch (s) {
          case "Audio":
            return 1;
          default:
            return 0;
        }
      };
      const k1 = kind(a);
      const k2 = kind(b);
      return k1 != k2 ? _.lt(k1, k2) : _.lt(a, b);
    };
    let tab = tabs.find((t) => t.key === key);
    if (!tab) {
      tab = { key, label: getLabel(key), content: [] };
      for (let i = 0; i < tabs.length; i++) {
        if (lt(tab.label, tabs[i].label)) {
          tabs.splice(i, 0, tab);
          return tab;
        }
      }
      tabs.push(tab);
    }
    return tab;
  };

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
          <Box w="100%" h="100%" p={5}>
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
          <>
            {_.isEmpty(tabs) ? null : (
              <Box>
                <Tabs maxW={slideWidth}>
                  <TabList maxW={slideWidth}>
                    {tabs.map((t, i) => (
                      <Tab key={i}>{t.label}</Tab>
                    ))}
                  </TabList>
                  <TabPanels maxW={slideWidth}>
                    {tabs.map((t, i) => (
                      <TabPanel key={i} maxW={slideWidth}>
                        <div className={styles.table_container}>
                          <table>
                            <tbody>{t.content}</tbody>
                          </table>
                        </div>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </Box>
            )}
          </>
        ) : null}
      </VStack>
    </Card>
  );
};

// TODO improve toolbar
const ToolBar: React.FC<any> = ({
  showMore,
  setShowMore,
  text,
  tags: inputTags,
}) => {
  const tags: string[] = _.take(_.isEmpty(inputTags) ? ["UNKNOWN"] : inputTags, 3);
  return (
    <HStack
      w="100%"
      py={2}
      px={5}
      spacing={5}
      justify="space-between"
      overflow="hidden"
    >
      <Box flex="1 1 25px">
        <ShowMore showMore={showMore} setShowMore={setShowMore} />
      </Box>
      <HStack flex="1 1 300px" overflow="hidden">
        {tags.map((tag, key) => (
          <Badge
            key={key}
            variant="solid"
            rounded="full"
            px={2}
            overflow="hidden"
            fontFamily="monospace"
            fontSize="md"
            flex={`0 0 auto`}
            title={tag}
            textOverflow="ellipsis"
          >
            {tag}
          </Badge>
        ))}
      </HStack>
      <HStack flex="1 0 50px">
        <KnowButton text={text} />
        <BookmarkButton text={text} />
      </HStack>
    </HStack>
  );
};

export default DataCard;
