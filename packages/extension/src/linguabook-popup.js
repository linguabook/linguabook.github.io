console.log("LinguaBook extension is loaded");

var iframeContainer;

document.addEventListener("click", function (e) {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  if (!e.target && e.target.containsNode(selection.anchorNode)) {
    return;
  }
  const text = (selection.toString() || "").trim();
  if (!text || !isWord(text)) {
    return;
  }

  var width = "512px";
  var height = "800px";

  // for local dev
  // var appURL = "http://localhost:3000";
  var appURL = "https://linguabook.github.io";
  var iframe = document.createElement("iframe");
  iframe.src = appURL + "/?search-string=" + encodeURIComponent(text);
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.onload = function () {
    var eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, function (e) {
      if (e.data === "LBOOK.CLOSE" && iframeContainer) {
        iframeContainer.parentElement.removeChild(iframeContainer);
        iframeContainer = undefined;
      }
    });
  };

  // TODO reuse iframe
  if (iframeContainer) {
    iframeContainer.parentElement.removeChild(iframeContainer);
    iframeContainer = undefined;
  }

  // TODO position relative to selected text range
  iframeContainer = document.createElement("div");
  iframeContainer.style.position = "absolute";
  iframeContainer.style.width = width;
  iframeContainer.style.height = height;
  iframeContainer.style.top = "0";
  iframeContainer.style.overflow = "auto";
  iframeContainer.style.zIndex = "999999";
  iframeContainer.appendChild(iframe);

  document.body.appendChild(iframeContainer);
});

function isWord(s) {
  return /[\w-]+/.test(s);
}
