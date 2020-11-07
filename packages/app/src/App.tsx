import React from "react";
import WordsApp from "words-app-components";
import "words-app-components/dist/index.css";

import styles from "./App.module.css";

const App = () => <WordsApp className={`${styles.app} ${styles.dark}`} dark />;

export default App;
