import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImport from "eslint-plugin-unused-imports";
import tailwindConfig from "eslint-plugin-tailwindcss";


export default [
  { ignores: ["tailwind.config.js"] },
  { languageOptions: { globals: globals.browser } },
  {
    files: ["src/**/*.tsx"],
    plugins: {
      tailwindcss: tailwindConfig,
    },
    rules: {
      ...tailwindConfig.configs.recommended.rules,
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      simpleImportSort: simpleImportSort,
      unusedImport: unusedImport,
    },
    rules: {
      "simpleImportSort/imports": [
        "error",
        {
          groups: [
            // side effect (e.g. `import "./foo"`)
            ["^\\u0000"],
            // `react`.
            [
              "^react",
              // things that start with a letter (or digit or underscore), or `@` followed by a letter
              "^@?\\w",
            ],
            // internal
            ["^@/"],
            // relative parent (e.g. `import ... from ".."`)
            ["^\\.\\.(?!/?$)"],
            ["^\\.\\./?$"],
            // relative same folder (e.g. `import ... from "./"`)
            ["^\\./(?=.*/)(?!/?$)"],
            ["^\\.(?!/?$)"],
            ["^\\./?$"],
            // type (e.g. `import type { ... } from "..."`)
            ["^.*\\u0000$"],
            // css
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simpleImportSort/exports": "error",
      "unusedImport/no-unused-imports": "error",
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
