import { PersistableWordList, useWordList } from "./CustomWordList";

class KnownWordList extends PersistableWordList {
  constructor() {
    super("linguabook.known_words");
  }

  static __instance: KnownWordList;

  static get instance() {
    if (!KnownWordList.__instance) {
      KnownWordList.__instance = new KnownWordList();
    }
    return KnownWordList.__instance;
  }
}

export default function useKnownWords() {
  return useWordList(KnownWordList.instance);
}
