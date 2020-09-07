import { fetchData } from "lingua-scraper";

console.log("Hey! I am Lingvo Bot!");

document.addEventListener("click", (e) => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  if (!e.target && e.target.containsNode(selection.anchorNode)) {
    return;
  }
  const text = selection.toString();
  console.log("longuabot searching", text);
  fetchData(text).then((results) => {
    console.log(results);
  });
});
