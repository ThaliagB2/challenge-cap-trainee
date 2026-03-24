import globals from 'globals';

import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

import pluginJs from '@eslint/js';

export default [
    {
        ignores: ['./gen/*.{js,ts}', '.vscode', '@cds-models', 'node_modules', 'test']
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            prettier
        },
        files: ['**/*.{mjs,js,ts}'],
        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    tabWidth: 4,
                    trailingComma: 'none',
                    bracketSpacing: true,
                    printWidth: 180
                }
            ],
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^ignore',
                    ignoreRestSiblings: true
                }
            ],
            '@typescript-eslint/no-var-requires': 'off',
            'eol-last': 'error',
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],
            'linebreak-style': 'off',
            'max-len': [
                'error',
                {
                    code: 180,
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true
                }
            ],
            'max-lines-per-function': ['warn', 30],
            'no-console': 'error',
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single'],
            'quote-props': ['error', 'as-needed'],
            semi: ['error', 'always']
        }
    },
    {
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                project: './tsconfig.eslint.json'
            }
        }
    }
];
