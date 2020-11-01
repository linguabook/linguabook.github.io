import React from "react";
import { renderToString } from "react-dom/server";
import App from "../App";

describe("renderToString", () => {
  it("App is not crashing", () => {
    renderToString(<App />);
  });
});
