/* eslint-disable no-undef */

module.exports = {
  // provides predefined global variables
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    // enforces consistent brace style
    curly: "warn",
    // enforces a maximum number lines per file
    "max-lines": ["warn", { max: 200 }],
    // enforces a maximum number of characters per line
    "max-len": ["warn", { code: 120, comments: 140 }],
    // enforces a maximum number of parameters in functions
    "max-params": ["warn", { max: 4 }],
    // TODO deprecated: use padding-line-between-statements instead
    "newline-before-return": "warn",
    // disallows expressions where the operation doesn't affect the value
    "no-constant-binary-expression": "warn",
    // disallows the user of debugger
    "no-debugger": "warn",
    // TODO deprecated: use eslint-plugin-node instead
    "no-process-env": "warn",
    // enforces the use of named constants instead of raw numbers
    "no-magic-numbers": [
      "warn",
      {
        enforceConst: true,
        ignore: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ignoreArrayIndexes: true, // e.g., data[2] is considered OK
      },
    ],
    // empty lines after the last top-level import statement
    "import/newline-after-import": "warn",
    // ensures that there is no circular import
    "import/no-cycle": "warn",
    // old rule for compatibility with Babel 5
    "import/no-named-as-default-member": "off",
    // forbids a module from importing itself
    "import/no-self-import": "warn",
    // the shorter the path, the better
    "import/no-useless-path-segments": ["warn", { noUselessIndex: true }],
    // enforces a convention in the order of the import/require statements
    "import/order": ["warn", { "newlines-between": "always" }], // no new lines
    // only call Hooks at the Top Level & from React functions
    "react-hooks/rules-of-hooks": "error",
    // prevents from missing dependencies inside effects
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
        project: ["./tsconfig.json", "./tsconfig.eslint.json"],
      },
      rules: {
        // requires explicit return types on functions & methods
        "@typescript-eslint/explicit-function-return-type": "warn",
        // enforces using type parameter when calling Array#reduce
        "@typescript-eslint/prefer-reduce-type-parameter": "warn",
        // enforces using String#startsWith and String#endsWith
        "@typescript-eslint/prefer-string-starts-ends-with": "warn",
        // enforces using concise optional chain expressions
        "@typescript-eslint/prefer-optional-chain": "warn",
        // disallows two overloads that could be unified into one
        "@typescript-eslint/unified-signatures": "warn",
        // consistent style in classes
        "@typescript-eslint/class-literal-property-style": "warn",
        // const map = new Map<string, number>();
        "@typescript-eslint/consistent-generic-constructors": "warn",
        // requires or disallow the Record type
        "@typescript-eslint/consistent-indexed-object-style": "warn",
        // enforces consistent usage of type assertions
        "@typescript-eslint/consistent-type-assertions": "warn",
        // enforces consistent usage of type exports
        "@typescript-eslint/consistent-type-exports": ["warn", { fixMixedExportsWithInlineTypeSpecifier: true }],
        // enforces consistent usage of type imports
        "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
        // disallows using the delete operator on computed key expressions
        "@typescript-eslint/no-dynamic-delete": "warn",
        // disallows non-null assertion in confusing locations
        "@typescript-eslint/no-confusing-non-null-assertion": "warn",
        // disallows type arguments that are equal to the default
        "@typescript-eslint/no-unnecessary-type-arguments": "warn",
        // disallows (something === true)
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
      },
    },
    {
      files: ["*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
        // properties & attributes should be camelCased
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
  root: true,
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],

        extensions: [".js", ".jsx"],
      },
      typescript: true,
      // node: true,
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["node_modules", "build", "dist", "coverage"],
};
