import globals from "globals";
import pluginJs from "@eslint/js";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    plugins: { "no-relative-import-paths": noRelativeImportPaths },
    rules: {
      "no-unused-vars": "off",

      // 같은 폴더인 경우를 제외하고 import 경로는 항상 절대 경로를 사용
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: true, rootDir: "src", prefix: "@" },
      ],
    },
  },
];
