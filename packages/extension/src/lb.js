console.log("LB extension is loading!");

const SVG = {
  icon: (props) => {
    const { width = "16px", height = "16px" } = props;
    return `<svg fill="#000000" height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 452.707 452.707">
    <g>
      <path d="m234.873,126.705h-12.348c-5.523,0-10,4.477-10,10v43.498 43.498c0,5.523 4.477,10 10,10h21.749c17.506,0 31.749-14.242 31.749-31.749 0-11.08-5.709-20.847-14.336-26.529 3.12-4.913 4.936-10.731 4.936-16.969-0.001-17.506-14.244-31.749-31.75-31.749zm-2.348,20h2.348c6.479,0 11.749,5.271 11.749,11.749s-5.271,11.749-11.749,11.749h-2.348v-23.498zm11.749,66.996h-11.749v-23.498h2.348 9.401c6.478,0 11.749,5.271 11.749,11.749-0.001,6.479-5.271,11.749-11.749,11.749z"/>
      <path d="m310.048,146.708c6.479,0 11.75,5.271 11.75,11.75 0,5.523 4.477,10 10,10s10-4.477 10-10c0-17.507-14.243-31.75-31.75-31.75s-31.75,14.243-31.75,31.75v43.49c0,17.507 14.243,31.75 31.75,31.75s31.75-14.243 31.75-31.75c0-5.523-4.477-10-10-10s-10,4.477-10,10c0,6.479-5.271,11.75-11.75,11.75s-11.75-5.271-11.75-11.75v-43.49c0-6.479 5.271-11.75 11.75-11.75z"/>
      <path d="m150.541,233.383c0.84,0.217 1.682,0.321 2.511,0.321 4.449,0 8.509-2.991 9.675-7.499l3.258-12.598h19.118l3.258,12.599c1.383,5.347 6.839,8.559 12.186,7.177 5.347-1.383 8.561-6.838 7.178-12.185l-22.499-86.996c-1.142-4.413-5.123-7.496-9.682-7.496s-8.54,3.083-9.682,7.496l-22.499,86.996c-1.383,5.346 1.831,10.802 7.178,12.185zm29.389-39.777h-8.773l4.387-16.962 4.386,16.962z"/>
      <path d="m331.798,242.2h-178.753c-5.523,0-10,4.477-10,10s4.477,10 10,10h178.753c5.523,0 10-4.477 10-10s-4.477-10-10-10z"/>
      <path d="m153.045,116.707h178.753c5.523,0 10-4.477 10-10s-4.477-10-10-10h-178.753c-5.523,0-10,4.477-10,10s4.477,10 10,10z"/>
      <path d="m379.771,0h-262.655c-29.875,0-54.18,24.305-54.18,54.18v344.346c0,29.875 24.305,54.181 54.18,54.181h262.654c5.523,0 10-4.477 10-10v-432.707c0.001-5.523-4.476-10-9.999-10zm-10,344.346h-242.655v-324.346h242.654v324.346zm-262.654-322.85v323.791c-9.048,1.696-17.311,5.639-24.18,11.24v-302.347c0-15.368 10.197-28.398 24.18-32.684zm10,411.211c-18.847,0-34.18-15.333-34.18-34.181 0-18.847 15.333-34.18 34.18-34.18h252.654v10.18h-230.654c-5.523,0-10,4.477-10,10s4.477,10 10,10h230.655v8h-60.655c-5.523,0-10,4.477-10,10s4.477,10 10,10h60.655v10.181h-252.655z"/>
    </g>
  </svg>`;
  },
};

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
