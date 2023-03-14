/* eslint-disable no-undef */
/* eslint max-lines: ["warn", 150] */

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    curly: "warn",
    "max-lines": ["warn", { max: 120 }],
    "max-len": ["warn", { code: 120, comments: 140 }],
    "max-params": ["warn", { max: 4 }],
    "newline-before-return": "warn",
    "no-constant-binary-expression": "warn",
    "no-debugger": "warn",
    "no-process-env": "warn",
    "no-magic-numbers": [
      "warn",
      {
        enforceConst: true,
        ignore: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ignoreArrayIndexes: true,
      },
    ],
    "import/newline-after-import": "warn",
    "import/no-cycle": "warn",
    "import/no-named-as-default-member": "off",
    "import/no-self-import": "warn",
    "import/no-useless-path-segments": ["warn", { noUselessIndex: true }],
    "import/order": ["warn", { "newlines-between": "always" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/typescript",
      ],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      rules: {
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/prefer-reduce-type-parameter": "warn",
        "@typescript-eslint/prefer-string-starts-ends-with": "warn",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/unified-signatures": "warn",
        "@typescript-eslint/class-literal-property-style": "warn",
        "@typescript-eslint/consistent-generic-constructors": "warn",
        "@typescript-eslint/consistent-indexed-object-style": "warn",
        "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/consistent-type-exports": ["warn", { fixMixedExportsWithInlineTypeSpecifier: true }],
        "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
        "@typescript-eslint/no-dynamic-delete": "warn",
        "@typescript-eslint/no-confusing-non-null-assertion": "warn",
        "@typescript-eslint/no-unnecessary-type-arguments": "warn",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
      },
    },
    {
      files: ["*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
        "react/no-unknown-property": [
          "error",
          {
            ignore: [
              "args",
              "position",
              "map",
              "matcap",
              "castShadow",
              "receiveShadow",
              "dispose",
              "geometry",
              "rotation",
              "metalness",
              "roughness",
              "side",
              "side",
              "specular",
              "attach",
              "visible",
              "intensity",
            ],
          },
        ],
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      extends: ["plugin:jest/recommended", "plugin:jest/style"],
      rules: {
        "no-magic-numbers": "off",
        "@typescript-eslint/unbound-method": "off",
        "jest/valid-title": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "import", "jest", "prettier"],
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
