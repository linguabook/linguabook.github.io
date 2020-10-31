import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { SearchInput, useSearchState } from "./components/SearchInput";
import "./components/icons";

function App() {
  const search = useSearchState();
  return (
    <div className="App">
      <div>
        <SearchInput
          value={search.text}
          onChange={search.onChange}
          reset={search.reset}
        />
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
