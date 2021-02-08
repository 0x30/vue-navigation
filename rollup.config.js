// rollup.config.js
import ts from "rollup-plugin-typescript2";

import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const pkg = require("./package.json");

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} 0x30:alphabetion@gmail.com
  * @license MIT
  */`;

const outputConfigs = {
  // each file name has the format: `dist/${name}.${format}.js`
  // format being a key of this object
  "esm-bundler": {
    file: pkg.module,
    format: `es`,
  },
  cjs: {
    file: pkg.main,
    format: `cjs`,
  },
  global: {
    file: pkg.unpkg,
    format: `iife`,
  },
  esm: {
    file: pkg.browser || pkg.module.replace("bundler", "browser"),
    format: `es`,
  },
};

const allFormats = Object.keys(outputConfigs);
// in vue-router there are not that many
const packageFormats = allFormats;
const packageConfigs = packageFormats.map((format) =>
  createConfig(format, outputConfigs[format])
);

export default packageConfigs;

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require("chalk").yellow(`invalid format: "${format}"`));
    process.exit(1);
  }

  output.sourcemap = !!process.env.SOURCE_MAP;
  output.banner = banner;
  output.externalLiveBindings = false;

  const external = ["vue", "vue-router-next", "vue-router"];

  const nodePlugins = [nodeResolve(), commonjs()];

  return {
    input: `src/index.ts`,
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [ts(), ...nodePlugins, ...plugins],
    output,
    // onwarn: (msg, warn) => {
    //   if (!/Circular/.test(msg)) {
    //     warn(msg)
    //   }
    // },
  };
}
