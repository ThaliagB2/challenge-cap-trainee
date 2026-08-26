import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    eslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsparser,
            parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
            globals: { ...globals.browser, ...globals.es2020, React: 'readonly' }
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'import': importPlugin,
            'react': react,
            'react-hooks': reactHooks
        },
        rules: {
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'quotes': ['error', 'single', { 'avoidEscape': true }],
            'semi': ['error', 'always'],
            'max-len': ['error', { 'code': 180, 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreTemplateLiterals': true }],
            'max-lines-per-function': ['error', { 'max': 30, 'skipBlankLines': true, 'skipComments': true }],
            'comma-dangle': ['error', 'always-multiline'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'error',
            'import/order': ['error', { 'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], 'alphabetize': { 'order': 'asc', 'caseInsensitive': true } }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': ['error', { 'prefer': 'type-imports' }],
            'no-console': 'off',
            'no-debugger': 'error',
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'eol-last': ['error', 'always'],
            'no-undef': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn'
        }
    },
    {
        files: ['**/*.tsx'],
        rules: { 'max-lines-per-function': 'off' }
    },
    {
        files: ['**/*.config.ts', '**/*.config.js', '**/*.config.mjs'],
        languageOptions: { globals: { ...globals.node } }
    },
    {
        ignores: ['node_modules/**', 'dist/**', '**/*.d.ts']
    }
];
