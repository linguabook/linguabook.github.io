import { fetchData } from "lingua-scraper";

console.log("Hey! I am LinguaBot!");

document.addEventListener("click", (e) => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  if (!e.target && e.target.containsNode(selection.anchorNode)) {
    return;
  }
  const text = selection.toString();
  if (!text) {
    return;
  }
  console.log("lingua-bot searching", text);
  fetchData(text)
    .then((results) => {
      console.log("lingua-bot results");
      console.log(results);
    })
    .catch((err) => {
      console.log("lingua-bot error:", err);
    });
});
