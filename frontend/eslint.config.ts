import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
//import pluginVuetify from 'eslint-plugin-vuetify'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
import { configureVueProject } from '@vue/eslint-config-typescript'
configureVueProject({ scriptLangs: ['ts', 'tsx', 'js'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

  export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

    {
      name: 'restrict-data-model-import',
      // since this config is already in frontend/, ** refers to frontend files
      files: ['**/*.{ts,tsx,js,jsx,vue}'],
      rules: {
        '@typescript-eslint/no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@lemac/data-model',
                message:
                  "In frontend, import '@lemac/data-model/browser' instead of '@lemac/data-model'.",
              },
            ],
          },
        ],

        'no-restricted-imports': [
           'error',
           {
             paths: [
               {
                 name: '@lemac/data-model',
                 message:
                   "In frontend, import '@lemac/data-model/browser' instead of '@lemac/data-model'.",
               },
             ],
           },
        ],
      },
    },
)