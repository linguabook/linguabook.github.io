import React from "react";
import { ogden } from "lingua-scraper";
import useQueryString from "./use-query-string";
import { PARAM_NAME } from "./use-search-state";
import styles from "./WordList.module.scss";

const WordList: React.FC<{}> = () => {
  const { setParam } = useQueryString();
  const selectWord = (word) => {
    setParam(PARAM_NAME, word);
  };

  const items = ogden.categories.map((c, k) => (
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

export default WordList;
