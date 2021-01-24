const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const svgr = require("@svgr/core").default;

function defaultTemplate(
  { template },
  opts,
  { imports, interfaces, componentName, props, jsx, exports }
) {
  const plugins = ["jsx"];
  if (opts.typescript) {
    plugins.push("typescript");
  }
  const typeScriptTpl = template.smart({ plugins });
  return typeScriptTpl.ast`function ${componentName}(${props}) {
  return ${jsx};
}`;
}

const ls = (dir, isdir = false) => {
  const list = fs.readdirSync(dir);
  return list
    .map((f) => path.resolve(dir, f))
    .filter((f) => fs.statSync(f).isDirectory() === isdir);
};

async function main() {
  const dir = path.resolve(__dirname, "node_modules/flag-icon-css/flags/4x3");
  const files = ls(dir).map((f) => path.resolve(dir, f));
  const icons = await Promise.all(
    files.map((f) => {
      const svg = fs.readFileSync(f, "utf-8");
      const name = path.basename(f, ".svg");
      const componentName = `Flag${_.capitalize(name)}`.replace("-", "_");
      return svgr(
        svg,
        { icon: true, template: defaultTemplate },
        { componentName }
      ).then((js) => ({
        iso2: name,
        js,
        componentName,
      }));
    })
  );
  const imports = `import React from "react";\n\n`;
  const funcs = icons.map((t) => t.js).join("\n\n");
  const iconMap =
    "\n\nexport const flags = {\n" +
    icons.map((t) => `  "${t.iso2}": ${t.componentName},`).join("\n") +
    "\n};\n";
  const code = imports + funcs + iconMap;
  fs.writeFileSync("./packages/components/src/flags.tsx", code, "utf-8");
}

main().catch(console.error);
