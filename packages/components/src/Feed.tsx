import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./DataCard";
import useKnownWords from "./use-known-words";
import { WordList } from "./internal-types";
import { flatWordList } from "./CustomWordList";

type Props = {
  wordList: WordList;
};

const Feed: React.FC<Props> = ({ wordList }) => {
  const pageSize = 2;
  const knownWords = useKnownWords();
  const allWords = useMemo(
    () => _.filter(flatWordList(wordList), (t) => !knownWords.has(t.text)),
    [wordList, knownWords]
  );

  const [words, setWords] = useState<typeof allWords>([]);

  useEffect(() => {
    const init = allWords.slice(0, pageSize);
    if (!_.isEqual(words, init)) {
      setWords(init);
    }
  }, [words, allWords]);

  const loadMore = () => {
    setTimeout(() => {
      setWords(allWords.slice(0, words.length + pageSize));
    }, 0);
  };

  const items = words
    .filter((w) => !knownWords.has(w.text))
    .map((w) => {
      return <Card key={w.text} text={w.text} lang="en" />;
    });
  return (
    <InfiniteScroll
      dataLength={words.length}
      next={loadMore}
      hasMore={words.length < allWords.length}
      loader={<div></div>}
    >
      {items}
    </InfiniteScroll>
  );
};

export default Feed;
