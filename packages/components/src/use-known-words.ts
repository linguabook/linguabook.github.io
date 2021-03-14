import _ from "lodash";
import { useEffect, useMemo } from "react";
import { atom, useRecoilState } from "recoil";

const KnownWords = atom({
  key: "linguabook.known_words",
  default: {},
});

export default function useKnownWords() {
  const [state, setState] = useRecoilState(KnownWords);

  useEffect(() => {
    const t = loadState();
    if (t && !_.isEqual(t, state)) {
      setState(t);
    }
  }, [state, setState]);

  return useMemo(() => {
    return {
      state,
      has(s: string) {
        return s && !!state[s.trim().toLowerCase()];
      },
      add(s: string) {
        s = _.trim(s);
        if (!s) {
          return;
        }
        s = s.toLowerCase();
        const newState = {
          ...state,
          [s]: 1,
        };
        setState(newState);
        saveState(newState);
      },
      remove(s: string) {
        s = _.trim(s);
        if (!s) {
          return;
        }
        s = s.toLowerCase();
        if (!state[s]) {
          return;
        }
        const newState = { ...state };
        delete newState[s];
        setState(newState);
        saveState(newState);
      },
    };
  }, [state, setState]);
}

function loadState() {
  const s = localStorage.getItem(KnownWords.key);
  if (!s) {
    return undefined;
  }
  try {
    const v = JSON.parse(s);
    if (_.isPlainObject(v)) {
      return v;
    }
  } catch (err) {}
  localStorage.removeItem(KnownWords.key);
  return undefined;
}

function saveState(state: any) {
  localStorage.setItem(KnownWords.key, JSON.stringify(state));
}
