type WordCategory = {
  name: string;
  words: {
    text: string;
    freq: number;
  }[];
};

export type WordList = {
  categories: WordCategory[];
};
