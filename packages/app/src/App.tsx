import React from "react";
import "./App.css";
import { SearchInput, useSearchState } from "./components/SearchInput";
import "./components/icons";
import VisualCard from "./components/VisualCard";

function App() {
  const search = useSearchState();
  return (
    <div className="App">
      <header>
        <SearchInput
          value={search.text}
          onChange={search.onChange}
          reset={search.reset}
        />
      </header>
      <main>
        {search.debouncedText ? (
          <VisualCard text={search.debouncedText} />
        ) : (
          <div>Nothing to show</div>
        )}
      </main>
    </div>
  );
}

export default App;
