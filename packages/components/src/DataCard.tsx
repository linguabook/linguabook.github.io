import _ from "lodash";
import React, { useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { fetchData } from "lingua-scraper";
import useSWR from "swr";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import cx from "classnames";
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
  exclude: string[];
  dark?: boolean;
};

type Tab = {
  key: string;
  label: string;
  content: any[];
};

const SourceHeader: React.FC<any> = ({ source }) => (
  <div className={styles.source_header}>
    <a href={source.url}>{source.name}</a>
  </div>
);

const Playlist: React.FC<any> = ({ source, audio }) => {
  if (_.isEmpty(audio)) {
    return null;
  }
  const items = audio.map((rec, i) => {
    return (
      <li key={i}>
        <SoundIcon url={rec.url} />
        <span>{rec.author || "human"}</span>
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

const DataCard: React.FC<Props> = ({ text, lang, exclude, dark }) => {
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
      <div className={styles.text_center}>
        <Loader />
      </div>
    );
  }

  const visual: any[] = [];
  const transcriptions: { text: string; source: string }[] = [];
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
      if (key === "transcription") {
        for (const item of data) {
          transcriptions.push({
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
    <Slide
      key={i}
      src={d.url}
      text={{ text, lang }}
      transcription={transcriptions[0] ? transcriptions[0].text : ""}
      audio={_.head(audio)}
      translations={translations.filter((t) => t.lang === "ru")}
    />
  ));

  if (_.isEmpty(visual) && _.isEmpty(tabs)) {
    return <Empty />;
  }

  return (
    <div
      className={cx(styles.card, {
        [styles.desktop]: desktop,
        [styles.dark]: dark,
      })}
    >
      {_.isEmpty(visual) ? null : (
        <div className={styles.visual}>
          <Carousel showThumbs={false} swipeable emulateTouch>
            {slides}
          </Carousel>
        </div>
      )}
      {showMore ? (
        <>
          {_.isEmpty(tabs) ? null : (
            <Tabs>
              <TabList>
                {tabs.map((t, i) => (
                  <Tab key={i}>{t.label}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {tabs.map((t, i) => (
                  <TabPanel key={i}>
                    <div className={styles.table_container}>
                      <table>
                        <tbody>{t.content}</tbody>
                      </table>
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          )}
          <ShowMore showMore={showMore} setShowMore={setShowMore} />
        </>
      ) : (
        <ShowMore showMore={showMore} setShowMore={setShowMore} />
      )}
    </div>
  );
};

const ShowMore: React.FC<any> = ({ showMore, setShowMore }) => {
  return (
    <Box className={styles.show_more} onClick={() => setShowMore(!showMore)}>
      {showMore ? "Show less" : "Show more"}
    </Box>
  );
};

export default DataCard;
