import _ from "lodash";
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { fetchData } from "lingua-scraper";
import useSWR from "swr";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import qs from "query-string";

import Error from "./ErrorCard";
import Loader from "./Loader";
import Empty from "./Empty";
import Less from "./Less";
import FlagIcon from "./FlagIcon";
import GenderIcon from "./GenderIcon";

import styles from "./DataCard.module.scss";
import { useDesktop } from "./hooks";

const nonPlural = ["audio"];

function getLabel(key: string) {
  if (key === "in") {
    return "Examples";
  }
  if (nonPlural.indexOf(key) >= 0) {
    return _.capitalize(key);
  }
  return _.capitalize(key) + "s";
}

type Props = {
  text: string;
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
    const play = () => {
      const sound = new Audio(rec.url);
      sound.play();
    };
    return (
      <li key={i}>
        <span className={styles.interactive_icon} onClick={play}>
          <Icon icon="volume-up" />
        </span>
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

const DataCard: React.FC<Props> = ({ text, exclude, dark }) => {
  const desktop = useDesktop();

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

  const width = desktop ? 800 : "100vw";

  const visual: any[] = [];
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

  for (const sourceData of _.flatten(sources)) {
    const source = sourceData.source;
    _.each(sourceData.data, (data, key) => {
      if (_.isEmpty(data)) {
        return;
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
        const audio = data.map((item) => ({
          source,
          ...(_.isString(item) ? { url: item } : item),
        }));
        tab.content.push(
          <Playlist
            key={`${source.name}-${key}`}
            source={source}
            audio={audio}
          />
        );
      } else {
        const tab = makeTab(key);
        const items = data.map((item) => ({
          text: item,
        }));
        tab.content.push(
          <Terms key={`${source.name}-${key}`} source={source} items={items} />
        );
      }
    });
  }

  const slides = visual.map((d, i) => (
    <div key={i} className={styles.slide}>
      <img src={d.url} alt={text} width={width} />
    </div>
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
    </div>
  );
};

export default DataCard;
