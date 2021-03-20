import _ from "lodash";
import { useEffect } from "react";
import EventEmitter from "eventemitter3";
import { ogden } from "lingua-scraper";
import useForceUpdate from "use-force-update";
import { WordList, Word } from "./internal-types";
import * as storage from "./storage";

export function flatWordList(list: WordList) {
  return _.uniqBy(
    _.orderBy(
      _.flatten(
        _.map(
          list.categories.map((c) =>
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
}

// TODO common cache
const OGDEN_WORDS = flatWordList(ogden).reduce(
  (m, t) => {
    m[t.text] = t;
    return m;
  },
  {} as {
    [s: string]: Word;
  }
) as {
  [s: string]: Word;
};

export class PersistableWordList extends EventEmitter {
  state: Set<string> = new Set<string>();

  constructor(private storageKey: string) {
    super();
    this.load();
  }

  get size() {
    return this.state.size;
  }

  nomalize = (key: string) => _.toLower(_.trim(key));

  has(word: string) {
    word = this.nomalize(word);
    if (!word) {
      return false;
    }
    return this.state.has(word);
  }

  add(word: string) {
    word = this.nomalize(word);
    if (!word) {
      return;
    }
    this.state.add(word);
    this.onChange();
  }

  delete(word: string) {
    word = this.nomalize(word);
    if (!word) {
      return;
    }
    this.state.delete(word);
    this.onChange();
  }

  load() {
    const words = storage.load(this.storageKey, "array") || [];
    if (!_.isEqual(words, Array.from(this.state))) {
      this.state = new Set<string>(words);
      this.emit("change");
    }
  }

  save() {
    storage.save(this.storageKey, Array.from(this.state));
  }

  onChange() {
    this.save();
    this.emit("change");
  }
}

export class CustomWordList extends PersistableWordList implements WordList {
  data: WordList | undefined;

  static __instance: CustomWordList;

  static get instance() {
    if (!CustomWordList.__instance) {
      CustomWordList.__instance = new CustomWordList();
    }
    return CustomWordList.__instance;
  }

  constructor() {
    super("linguabook.my_word_list");
  }

  get name() {
    return "mylist";
  }

  get categories() {
    if (!this.data) {
      this.rebuild();
    }
    return this.data!.categories;
  }

  onChange() {
    this.rebuild();
    super.onChange();
  }

  rebuild() {
    const words = _.map(Array.from(this.state), (w) => {
      const t = OGDEN_WORDS[w];
      if (t) {
        return t;
      }
      return {
        category: "Misc",
        text: w,
        freq: 0,
      };
    });
    const cats = _.groupBy(words, (t) => t.category);
    this.data = {
      name: "mylist",
      categories: _.map(cats, (t, name) => ({
        name,
        words: t,
      })),
    };
  }
}

export function useWordList(list: PersistableWordList) {
  const update = useForceUpdate();

  useEffect(() => {
    list.on("change", update);
    return () => {
      list.off("change", update);
    };
  }, [update]);

  return list;
}

export function useMyWords() {
  return useWordList(CustomWordList.instance);
}
