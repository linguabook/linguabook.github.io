import _ from "lodash";
import React from "react";
import { fetchData } from "lingua-scraper";
import useSWR from "swr";
import {
  CarouselProvider,
  Slider,
  Slide,
  DotGroup,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.cjs.css";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

import Error from "./ErrorCard";
import Loader from "./Loader";
import Empty from "./Empty";

import styles from "./DataCard.module.scss";

type Props = {
  text: string;
};

const DataCard: React.FC<Props> = ({ text }) => {
  const { data: sources, error } = useSWR(`/lingua-data/${text}`, () =>
    fetchData({ text })
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
  const audio: any[] = [];
  const terms: any[] = [];

  for (const source of sources) {
    _.each(source.data, (data, key) => {
      if (key === "visual" || key === "audio") {
        const target = key === "visual" ? visual : audio;
        for (const item of data) {
          target.push({
            source: source.source,
            ...(_.isString(item) ? { url: item } : item),
          });
        }
      }
    });
  }

  const slides = visual.map((d, i) => (
    <Slide key={i} index={i}>
      <img src={d.url} alt={text} height={height} />
    </Slide>
  ));

  console.log(audio);

  const playlist = audio.map((rec, i) => {
    const play = () => {
      const sound = new Audio(rec.url);
      sound.play();
    };
    return (
      <li key={i}>
        <button onClick={play}>
          <Icon icon="play-circle" />
        </button>
        <span>{rec.author || rec.source.name}</span>
      </li>
    );
  });

  if (_.isEmpty(visual) && _.isEmpty(audio)) {
    return <Empty />;
  }

  return (
    <div>
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
      {_.isEmpty(audio) ? null : (
        <ul className={styles.playlist}>{playlist}</ul>
      )}
    </div>
  );
};

export default DataCard;
