module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // We assert on API responses inside loops/branches for CRUD flows.
    'playwright/no-conditional-in-test': 'off',
  },
  ignorePatterns: ['node_modules', 'playwright-report', 'test-results', 'dist', '.features-gen'],
  overrides: [
    {
      // Cucumber step definitions assert inside Given/When/Then callbacks,
      // not inside a test()/it() block, which this rule doesn't recognize.
      files: ['steps/**/*.ts'],
      rules: {
        'playwright/no-standalone-expect': 'off',
      },
    },
  ],
};
