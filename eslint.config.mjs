import globals from 'globals';
import vuetify from 'eslint-plugin-vuetify';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['dist', 'build', '.cache', 'vueInstallFolder'],
    files: ["**/*.{js,vue}"],
  },

  ...vue.configs['flat/recommended'],
  ...vuetify.configs['flat/recommended'],

  {
    files: ['backend/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
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
    }
  },
];
