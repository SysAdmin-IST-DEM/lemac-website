import globals from 'globals';
import vuetify from 'eslint-plugin-vuetify';
import vue from 'eslint-plugin-vue';

export default [
  {
    ignores: ['dist', 'build', '.cache', 'vueInstallFolder'],
    files: ["**/*.{js,vue}"],
  },

  ...vue.configs['flat/base'],
  ...vuetify.configs['flat/base'],

  {
    files: ['backend/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ['frontend/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    }
  },
];
