module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json', './packages/core/tsconfig.json','./packages/layout/tsconfig.json']
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    // 'no-unused-vars': 'warn',
    // '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/consistent-type-exports': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'warn',
    'vue/require-default-prop': 'off',
    'vue/no-setup-props-destructure': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/one-component-per-file': 'off',
  },
}
