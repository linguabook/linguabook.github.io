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
  useColorMode,
} from "@chakra-ui/react";
import { fetchData } from "lingua-scraper";
import useSWR from "swr";

import cx from "clsx";
import qs from "query-string";

import Error from "./ErrorCard";
import Loader from "./Loader";
import Empty from "./Empty";
import Less from "./Less";
import FlagIcon from "./FlagIcon";
import GenderIcon from "./GenderIcon";
import SoundIcon from "./SoundIcon";
import Slide from "./Slide";

import styles from "./DataCard.module.scss";
import { useDesktop } from "./hooks";

import SwiperCore, { Navigation, A11y, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import {
  ShowMore,
  KnowButton,
  LikeButton,
  ShareButton,
  BookmarkButton,
} from "./buttons";
import Card from "./Card";
import useConfigState from "./use-config-menu";
import { useDarkMode } from "./use-dark-mode";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

const SLIDE_WIDTH = 512;

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

const SourceHeader: React.FC<any> = ({ source }) => {
  const { colorMode } = useColorMode();
  const color = colorMode == "dark" ? "blue.100" : "gray.300";
  return (
    <Text
      textColor={color}
      letterSpacing="wide"
      className={styles.source_header}
      fontWeight="bold"
    >
      <a href={source.url}>{source.name}</a>
    </Text>
  );
};

const Playlist: React.FC<any> = ({ source, audio }) => {
  if (_.isEmpty(audio)) {
    return null;
  }
  const items = audio.map((rec, i) => {
    return (
      <li key={i}>
        <SoundIcon url={rec.url} />
        <Text>{rec.author || "human"}</Text>
        <span className={styles.ml}>
          <GenderIcon gender={rec.gender} />
        </span>
        <span className={styles.ml}>
          <FlagIcon country={rec.country} />
        </span>
      </li>
    );
  });
  return (
    <tr className={styles.list_container}>
      <td>
        <SourceHeader source={source} />
        <ul className={styles.playlist}>{items}</ul>
      </td>
    </tr>
  );
};

const Terms: React.FC<any> = ({ source, items }) => {
  if (_.isEmpty(items)) {
    return null;
  }
  const nodes = items.map((rec, i) => {
    return (
      <li key={i}>
        <Less maxLines={3}>{rec.text}</Less>
      </li>
    );
  });
  return (
    <tr className={styles.list_container}>
      <td>
        <SourceHeader source={source} />
        <ul className={styles.terms}>{nodes}</ul>
      </td>
    </tr>
  );
};

const DataCard: React.FC<Props> = ({ text, lang }) => {
  const dark = useDarkMode();
  const { exclude } = useConfigState();
  const desktop = useDesktop();
  const [showMore, setShowMore] = useState(false);

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
  type TextItem = { text: string; source: string };
  const textData = {
    transcription: [] as TextItem[],
    definition: [] as TextItem[],
  };
  const translations: { text: string; lang: string; source: string }[] = [];
  const audio: { source: any; url: string }[] = [];
  let tabs: Tab[] = [];

  const makeTab = (key) => {
    let tab = tabs.find((t) => t.key === key);
    if (!tab) {
      tab = { key, label: getLabel(key), content: [] };
      for (let i = 0; i < tabs.length; i++) {
        if (_.lt(tab.label, tabs[i].label)) {
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
          textData[key].push({
            text: item,
            source: source.name,
          });
        }
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
            audio={audioData}
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
          <Terms key={`${source.name}-${key}`} source={source} items={items} />
        );
      }
    });
  }

  const slides = visual.map((d, i) => (
    <SwiperSlide
      key={i}
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_WIDTH / 2,
      }}
    >
      <Slide
        src={d.url}
        text={{ text, lang }}
        transcription={
          textData.transcription[0] ? textData.transcription[0].text : ""
        }
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
                width: SLIDE_WIDTH,
              }}
            >
              {slides}
            </Swiper>
          </div>
        )}
        {textData.definition[0] && textData.definition[0].text ? (
          <Box w="100%" h="100%" p={5}>
            <Text>{textData.definition[0].text}</Text>
          </Box>
        ) : null}
        <ToolBar showMore={showMore} setShowMore={setShowMore} text={text} />
        {showMore ? (
          <>
            {_.isEmpty(tabs) ? null : (
              <Box>
                <Tabs maxW={SLIDE_WIDTH}>
                  <TabList maxW={SLIDE_WIDTH}>
                    {tabs.map((t, i) => (
                      <Tab key={i}>{t.label}</Tab>
                    ))}
                  </TabList>
                  <TabPanels maxW={SLIDE_WIDTH}>
                    {tabs.map((t, i) => (
                      <TabPanel key={i} maxW={SLIDE_WIDTH}>
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
const ToolBar: React.FC<any> = ({ showMore, setShowMore, text }) => {
  return (
    <HStack w="100%" py={2} px={5} spacing={5}>
      <ShowMore showMore={showMore} setShowMore={setShowMore} />
      <Text>Part of Speech?</Text>
      <KnowButton text={text} />
      <BookmarkButton text={text} />
      <ShareButton />
    </HStack>
  );
};

export default DataCard;
