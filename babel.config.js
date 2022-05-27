module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    "styled-components",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-export-default-from",
  ],
  env: {
    development: {
      plugins: [["inline-dotenv"]],
    },
    production: {
      only: ["app"],
      plugins: [
        ["inline-dotenv"],
        "lodash",
        "transform-react-remove-prop-types",
        "@babel/plugin-transform-react-inline-elements",
        "@babel/plugin-transform-react-constant-elements",
      ],
    },
    test: {
      plugins: [
        "@babel/plugin-transform-modules-commonjs",
        "dynamic-import-node",
      ],
    },
  },
};
