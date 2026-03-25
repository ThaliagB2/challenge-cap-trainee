import globals from 'globals';

import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['gen', '.vscode', '@cds-models', 'node_modules']
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig, // <-- desativa regras do ESLint que conflitam com Prettier
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
                'error',
                {
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^ignore',
                    ignoreRestSiblings: true
                }
            ],
            '@typescript-eslint/no-var-requires': 'off',
            'eol-last': 'error',
            // indent, quotes, semi, object-curly-spacing e quote-props removidos
            // pois agora são controlados pelo Prettier via prettier/prettier
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
            'sort-imports': [
                'error',
                {
                    memberSyntaxSortOrder: ['single', 'all', 'multiple', 'none'],
                    allowSeparatedGroups: true
                }
            ]
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
