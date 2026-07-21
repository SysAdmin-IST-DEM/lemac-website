// eslint.config.js
import vuetify from 'eslint-config-vuetify'

export default vuetify(
  {
    ts: true,
  },

  {
    name: 'project-overrides',
    files: ['**/*.{ts,tsx,js,jsx,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@lemac/data-model',
              message: "In frontend, import '@lemac/data-model/browser' instead of '@lemac/data-model'.",
            },
          ],
        },
      ],

      'unicorn/no-array-sort': 'off',
      '@stylistic/quotes': 'off',
      'unicorn/no-this-outside-of-class': 'off',
      'vue/block-lang': 'off',
      'import/first': 'off',
    },
  },
)
