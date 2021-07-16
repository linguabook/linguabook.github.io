const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const pSeries = require("p-series");
const { ogden, dolch } = require("lingua-scraper");

async function main() {
  const a1 = _.flatMap(ogden.categories, (t) => t.words);
  const a2 = _.flatMap(dolch.categories, (t) => t.words);
  const words = _.uniq(a1.concat(a2).map((t) => t.text));
  const outDir = path.resolve(
    __dirname,
    "../packages/components/src/generated-cards"
  );

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  // generate index
  const compMapProps = words
    .map((w) => {
      const name = w.toLowerCase();
      return `  "${name}": React.lazy(() => import("./${name}"))`;
    })
    .join(",\n");
  const code = `
// warning: this file is auto generated
import React from "react";

export const ComponentMap: any = {
${compMapProps}
};
`;
  await fs.promises.writeFile(path.resolve(outDir, "index.tsx"), code, "utf-8");

  // generate card component for each word
  const tasks = words.map((text) => async () => {
    const wordKey = text.toLowerCase();
    const compFile = path.resolve(outDir, `${wordKey}.tsx`);
    const code = `
// warning: this file is auto generated
import React from "react";
import { JsonCard } from "../DataCard";

const Card = () => {
  const url = "https://raw.githubusercontent.com/linguabook/data/main/words/${wordKey}.json";
  return <JsonCard url={url} text="${text}" lang="en" />;
};

export default Card;
`;
    await fs.promises.writeFile(compFile, code, "utf-8");
  });
  await pSeries(_.take(tasks, 10000));
  process.exit();
}

main().catch(console.error);
