console.log("LB extension is loading!");

const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
const IS_NUMBER = /^[-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?$/;

function strStyleValue(name, val) {
  if (val === null || val === undefined) {
    return undefined;
  }
  if (IS_NON_DIMENSIONAL.test(name) === false) {
    if (typeof val === "number") {
      return val === 0 ? "0" : `${val}px`;
    }
    if (typeof val === "string") {
      const s = val.trim();
      if (!s) {
        return undefined;
      }
      return IS_NUMBER.test(s) ? `${s}px` : s;
    }
    return "0";
  }
  return String(val);
}

// makes HTML element in react style
const h = (type, props = {}) => {
  const { className, innerHTML, children, container, style, ...attrs } = props;
  const el = document.createElement(type);
  if (className) {
    el.className = className;
  }
  if (style) {
    const styles = Object.entries(style)
      .map(([k, v]) => [k, strStyleValue(k, v)])
      .filter(([k, v]) => !!v)
      .map(([k, v]) => `${k}: ${v}`)
      .join(";");
    if (styles) {
      el.setAttribute("style", styles);
    }
  }
  for (const [k, v] of Object.entries(attrs)) {
    // TODO serialize attribute
    el.setAttribute(k, String(v));
  }
  if (children) {
    for (const child of Array.isArray(children) ? children : [children]) {
      if (typeof child === "function") {
        const childEl = child();
        el.appendChild(childEl);
      } else if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    }
  } else if (innerHTML) {
    el.innerHTML = innerHTML;
  }
  if (container) {
    container.appendChild(el);
  }
  return el;
};

function addMainButton() {
  const btn = h("div", { className: "lb_main_btn", container: document.body });

  Popper.createPopper(document.body, btn);
}

function addPanel() {
  const panel = h("div", {
    container: document.body,
    className: "lb_draggable lb_panel",
    children: [
      // TODO add grip
      h("div", { className: "lb_panel_header", children: "Lingua Book" }),
      h("div", {
        className: "lb_panel_body",
        children: [
          h("iframe", {
            className: "lb_iframe",
            style: {
              width: "100%",
              height: "100%",
            },
            src: "https://linguabook.github.io",
          }),
        ],
      }),
    ],
  });
  // TODO make panel draggable using interact.js
}

addMainButton();
addPanel();

console.log("LB extension is loaded!");
