import _ from "lodash";
import React, { useState } from "react";
import { fetchData } from "lingua-scraper";
import useSWR from "swr";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.cjs.css";

import Error from "./ErrorCard";
import Loader from "./Loader";

type Props = {
  text: string;
};

const VisualCard: React.FC<Props> = ({ text }) => {
  const [slide, setSlide] = useState(0);

  const { data, error } = useSWR(`/visual/${text}`, () =>
    fetchData({ text }, { type: "visual" })
  );

  if (error) {
    return <Error error={error} />;
  }

  if (!data) {
    return <Loader />;
  }

  const width = 400;
  const height = 400;

  const items = _.flatten(
    data.map((s) =>
      s.data.visual.map((d) => ({
        source: s,
        url: _.isPlainObject(d) ? d.url : d,
      }))
    )
  );

  const slides = items.map((d, i) => (
    <Slide key={i} index={i}>
      <img src={d.url} alt={text} height={height} />
    </Slide>
  ));

  return (
    <CarouselProvider
      naturalSlideWidth={width}
      naturalSlideHeight={height}
      totalSlides={slides.length}
      currentSlide={slide}
      dragEnabled
    >
      <div style={{ height }}>
        <Slider>{slides}</Slider>
      </div>
      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
    </CarouselProvider>
  );
};

export default VisualCard;
