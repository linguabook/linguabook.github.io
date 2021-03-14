import React from "react";
import useQueryString from "./use-query-string";
import { PARAM_NAME } from "./use-search-state";
import { WordList } from "./internal-types";
import styles from "./WordList.module.scss";

type Props = {
  wordList: WordList;
};

const WordListView: React.FC<Props> = ({ wordList }) => {
  const { setParam } = useQueryString();
  const selectWord = (word) => {
    setParam(PARAM_NAME, word);
  };

  const items = wordList.categories.map((c, k) => (
    <li key={c.name} className={styles.item}>
      <h2 className={styles.category}>{c.name}</h2>
      <div>
        {c.words.map((word) => {
          const handleClick = (e) => {
            e.preventDefault();
            selectWord(word);
          };
          return (
            <a
              key={word.text}
              className={styles.word}
              onClick={handleClick}
              href={`#${word.text}`}
            >
              {word.text}
            </a>
          );
        })}
      </div>
    </li>
  ));
  return <ul className={styles.list}>{items}</ul>;
};

export default WordListView;
