import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "./src/index.ts",
  output: {
    file: "dist/nconnect.js",
    name: "NConnect",
    format: "umd"
  },
  plugins: [typescript(), commonjs({ extensions: [".js", ".ts"] })]
};
