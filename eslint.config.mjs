import globals from 'globals';
import vuetify from 'eslint-plugin-vuetify';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist', 'build', '.cache', 'vueInstallFolder'],
    files: ["**/*.{js,vue}"],
  },

  {
    files: ['backend/**.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: ['./backend/tsconfig.json']
      },
      globals: {
        ...globals.node,
      },
    },
    ...tseslint.configs.recommendedTypeChecked,
  },

  {
    files: ['frontend/**'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      globals: {
        ...globals.browser,
      },
    },
    extends: [
      ...vue.configs['flat/recommended'],
      ...vuetify.configs['flat/recommended']
    ]
  },
]);
