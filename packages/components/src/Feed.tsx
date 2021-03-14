import _ from "lodash";
import React, { useState } from "react";
import { ogden } from "lingua-scraper";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./DataCard";

const WORDS = _.uniqBy(
  _.orderBy(
    _.flatten(
      _.map(
        ogden.categories.map((c) =>
          c.words.map((w) => ({
            category: c.name,
            text: w.text,
            freq: w.freq,
          }))
        )
      )
    ),
    (t) => t.freq,
    "desc"
  ),
  (t) => t.text
);

type Props = {
  dark: boolean;
  exclude: string[];
};

const Feed: React.FC<Props> = ({ dark, exclude }) => {
  const pageSize = 2;
  const [words, setWords] = useState(() => WORDS.slice(0, pageSize));
  const loadMore = () => {
    setTimeout(() => {
      setWords(WORDS.slice(0, words.length + pageSize));
    }, 0);
  };
  const items = words.map((w) => {
    return (
      <Card
        key={w.text}
        text={w.text}
        lang="en"
        dark={dark}
        exclude={exclude}
      />
    );
  });
  return (
    <InfiniteScroll
      dataLength={words.length}
      next={loadMore}
      hasMore={words.length < WORDS.length}
      loader={<div></div>}
    >
      {items}
    </InfiniteScroll>
  );
};

export default Feed;
