console.log("LinguaBook extension is loaded");

var iframeContainer;

document.addEventListener("mouseup", function (e) {
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
    console.log("eventMethod", eventMethod);
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
  
  const placement = getPlacement();
  let top = "0";
  let left = "0";
  let width = "512px";
  let height = "100vh";
  
  if (placement && placement.ontop) {
    const b = placement.ontop.getBoundingClientRect();
    // width = b.width + "px";
    height = b.height + "px";
    left = b.left + "px";
    top = b.top + "px";
  }

  // TODO position relative to selected text range
  iframeContainer = document.createElement("div");
  iframeContainer.style.position = "absolute";
  iframeContainer.style.width = width;
  iframeContainer.style.height = height;
  iframeContainer.style.top = top;
  iframeContainer.style.left = left;
  iframeContainer.style.overflow = "auto";
  iframeContainer.style.zIndex = "999999";
  iframeContainer.appendChild(iframe);

  document.body.appendChild(iframeContainer);
});

function isWord(s) {
  return /^[\w-]+$/.test(s);
}

function getPlacement() {
  // TODO site map
  // google.com
  const google_kb_card = document.querySelector(".liYKde");
  if (google_kb_card) {
    return { ontop: google_kb_card };
  }
}
