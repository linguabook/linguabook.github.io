console.log("LinguaBook extension is loaded");

document.addEventListener("click", function (e) {
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

  const width = "512px";
  const height = "800px";

  const iframe = document.createElement("iframe");
  iframe.src =
    "https://linguabook.github.io/?search-string=" + encodeURIComponent(text);
  iframe.width = "100%";
  iframe.height = "100%";

  // TODO position relative to selected text range
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.width = width;
  container.style.height = height;
  container.style.top = "0";
  container.style.overflow = "auto";
  container.style.zIndex = "999999";
  container.appendChild(iframe);

  const closeBtn = document.createElement("button");
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "10px";
  closeBtn.innerHTML = "Close";
  closeBtn.addEventListener("click", function () {
    container.parentElement.removeChild(container);
  });
  container.appendChild(closeBtn);

  document.body.appendChild(container);
});
