import _ from "lodash";
import React, { useState } from "react";
import { fetchData } from "lingua-scraper";
import useSWR from "swr";
import { CarouselProvider, Slider, Slide, DotGroup } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.cjs.css";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import qs from "query-string";

import Error from "./ErrorCard";
import Loader from "./Loader";
import Empty from "./Empty";

import styles from "./DataCard.module.scss";

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
};

type Tab = {
  key: string;
  label: string;
  content: any[];
};

const SourceHeader: React.FC<any> = ({ source }) => (
  <div className={styles.source_header}>
    <a href={source.url}>
      {source.name}
    </a>
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
      </li>
    );
  });
  return (
    <div>
      <SourceHeader source={source} />
      <ul className={styles.playlist}>{items}</ul>
    </div>
  );
};

const Terms: React.FC<any> = ({ source, items }) => {
  if (_.isEmpty(items)) {
    return null;
  }
  const nodes = items.map((rec, i) => {
    return (
      <li key={i}>
        <span>{rec.text}</span>
      </li>
    );
  });
  return (
    <div>
      <SourceHeader source={source} />
      <ul className={styles.terms}>{nodes}</ul>
    </div>
  );
};

const DataCard: React.FC<Props> = ({ text, exclude }) => {
  const [activeTab, setActiveTab] = useState(0);

  const q = qs.stringify({ exclude });

  const { data: sources, error } = useSWR(
    `/words/data/${text}?${q}`,
    () => {
      return fetchData({ text }, { exclude });
    },
    {
      onSuccess() {
        setActiveTab(0);
      },
    }
  );

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

  const width = 400;
  const height = 400;

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

  for (const sourceData of sources) {
    const source = sourceData.source;
    _.each(sourceData.data, (data, key) => {
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
    <Slide key={i} index={i}>
      <img src={d.url} alt={text} height={height} />
    </Slide>
  ));

  if (_.isEmpty(visual) && _.isEmpty(tabs)) {
    return <Empty />;
  }

  return (
    <div className={styles.card}>
      {_.isEmpty(visual) ? null : (
        <div className={styles.visual}>
          <CarouselProvider
            naturalSlideWidth={width}
            naturalSlideHeight={height}
            totalSlides={slides.length}
          >
            <div style={{ height }}>
              <Slider>{slides}</Slider>
            </div>
            <div>
              <DotGroup />
            </div>
          </CarouselProvider>
        </div>
      )}
      {_.isEmpty(tabs) ? null : (
        <div className={styles.tabs}>
          {tabs.map((t, i) => (
            <span
              key={i}
              className={cx(styles.tab, { [styles.active]: i === activeTab })}
              onClick={() => setActiveTab(i)}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}
      {(tabs[activeTab] || {}).content}
    </div>
  );
};

export default DataCard;
