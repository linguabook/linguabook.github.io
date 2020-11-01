module.exports = {
  entry: "src/index.ts",
  output: {
    format: "cjs",
    moduleName: "WordsApp"
  },
  plugins: [
    {
      resolve: "@poi/plugin-typescript",
      options: {},
    },
  ],
  configureWebpack: {
    externals: {
      react: {
        root: "React",
        commonjs: "react",
        commonjs2: "react",
      },
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
  },
};
