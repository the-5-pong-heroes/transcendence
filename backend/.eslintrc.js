// ESLint VS Code extension:
// https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    // TODO eslint-plugin-node
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": 2, // Means error
    "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname, // directory name of the current module
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "prettier"],
  root: true,
  ignorePatterns: [".eslintrc.js"],
};
