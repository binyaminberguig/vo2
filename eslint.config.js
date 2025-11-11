// eslint.config.js
import eslintPluginPrettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.{ts,js}", "tests/*.{ts,js}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": ["error"],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "no-console": "warn",
    },
  },
];
