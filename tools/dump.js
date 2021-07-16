const _ = require("lodash");
const { ogden, dolch } = require("lingua-scraper");

async function main() {
  const a1 = _.flatMap(ogden.categories, (t) => t.words);
  const a2 = _.flatMap(dolch.categories, (t) => t.words);
  const a = a1.concat(a2);
  const words = _.orderBy(
    _.uniqBy(a, (t) => t.text),
    (t) => t.freq,
    "desc"
  );
  for (const w of words) {
    console.log(w.text);
  }
  process.exit();
}

main().catch(console.error);
