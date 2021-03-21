console.log("LinguaBook extension is loaded");

document.addEventListener("mouseup", function (e) {
  const text = getSelectedWord(e);
  if (!text) {
    return;
  }

  function action(label, text) {
    const event = `LB.${label}`;
    return `<button class="lb_extension_action" onclick="document.dispatchEvent(new CustomEvent('${event}', {detail: '${text}'}))">${label}</button>`;
  }

  const target = selection.anchorNode.parentElement;
  const tip = tippy(target, {
    allowHTML: true,
    content: `${action("SHOW", text)}`,
    interactive: true,
    sticky: true,
    trigger: "manual",
    getReferenceClientRect() {
      const range = selection.getRangeAt(0);
      const rect = range.getClientRects()[0];
      return rect;
    },
  });
  tip.show();
});

document.addEventListener("LB.SHOW", e => {
  showCard(e.detail);
});

function getSelectedWord(e) {
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
  return text;
}

function isWord(s) {
  return /^[\w-]+$/.test(s);
}

var iframeContainer;

function showCard(text) {
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
}

function getPlacement() {
  // TODO site map
  // google.com
  const google_kb_card = document.querySelector(".liYKde");
  if (google_kb_card) {
    return { ontop: google_kb_card };
  }
}
