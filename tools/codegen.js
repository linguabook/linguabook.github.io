const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const pSeries = require("p-series");
const { stringify } = require("javascript-stringify");
const { fetchData, ogden, dolch } = require("lingua-scraper");

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
    let data;
    try {
      data = await fetchData({ text });
    } catch (err) {
      console.log(`fetch '${text}' fail:`, err);
    }
    const compFile = path.resolve(outDir, `${text.toLowerCase()}.tsx`);
    const code = `
// warning: this file is auto generated
import React from "react";
import DataCard, { StatelessCard } from "../DataCard";

const DATA = ${data ? stringify(data) : "undefined"};

const StaticCard = () => {
  const Card = DATA ? StatelessCard : DataCard;
  return <Card text="${text}" lang="en" data={DATA}/>;
};

export default StaticCard;
`;
    await fs.promises.writeFile(compFile, code, "utf-8");
  });
  await pSeries(_.take(tasks, 10000));
  process.exit();
}

main().catch(console.error);
