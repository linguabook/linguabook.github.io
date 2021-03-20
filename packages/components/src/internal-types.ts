export type Word = {
  category?: string;
  text: string;
  freq: number;
};

export type WordCategory = {
  name: string;
  words: Word[];
};

export interface WordList {
  readonly name?: string;
  readonly categories: WordCategory[];
}
