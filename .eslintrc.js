module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // 'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        createDefaultProgram: true,
    },
    plugins: ['@typescript-eslint', '@typescript-eslint/tslint', 'eslint-plugin-prefer-arrow', 'eslint-plugin-import'],
    rules: {
        '@typescript-eslint/typedef': [
            'error',
            {
                'arrowParameter': true,
                'variableDeclaration': true,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
            },
        ],

        'indent': 'off',

        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',

        // '@typescript-eslint/indent': ['error', 4, { outerIIFEBody: 2 } ],

        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/member-delimiter-style': [
            'off',
            {
                multiline: {
                    delimiter: 'none',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/quotes': [ 'error', 'single' ],
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/semi': ['off', null],
        '@typescript-eslint/space-within-parens': ['off', 'never'],
        '@typescript-eslint/type-annotation-spacing': 'off',
        '@typescript-eslint/unified-signatures': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        'arrow-body-style': ['error', 'always'],
        'arrow-parens': ['error', 'as-needed'],
        camelcase: 'error',
        'comma-dangle': [
            'error',
            {
                'arrays': 'always-multiline',
                'objects': 'always-multiline',
                'imports': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'never',
            },
        ],
        complexity: 'off',
        'require-jsdoc': [
            'error',
            {
                'require':
                {
                    'FunctionDeclaration': true,
                    'MethodDefinition': true,
                    'ClassDeclaration': true,
                    'ArrowFunctionExpression': true,
                    'FunctionExpression': true,
                },
            },
        ],
        'constructor-super': 'error',
        curly: 'error',
        'dot-notation': 'error',
        'eol-last': 'error',
        eqeqeq: ['error', 'always'],
        'guard-for-in': 'error',
        'id-blacklist': ['error', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean'],
        'id-match': 'error',
        'import/no-deprecated': 'error',
        'import/order': 'off',
        'linebreak-style': 'off',
        'max-classes-per-file': [ 'error', 1 ],
        'max-len': [
            'error',
            {
                'code':     120,
                'tabWidth': 4,
            },
        ],
        'new-parens': 'off',
        'newline-per-chained-call': 'off',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': 'error',
        'no-debugger': 'error',
        'no-empty': 'error',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-extra-semi': 'off',
        'no-fallthrough': 'error',
        'no-invalid-this': 'error',
        'no-irregular-whitespace': 'off',
        'no-multiple-empty-lines': 'error',
        'no-new-wrappers': 'error',
        'no-shadow': [
            'error',
            {
                hoist: 'all',
            },
        ],
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'off',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'error',
        'no-unsafe-finally': 'error',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'object-shorthand': 'off',
        'one-var': ['error', 'never'],
/*
        'prefer-arrow/prefer-arrow-functions': [
            'error',
            {
                allowNamedFunctions: false,
                allowUnboundThis: true
            }
        ],
*/
        'quote-props': 'off',
        radix: 'error',
        'space-before-function-paren': 'off',
        'spaced-comment': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'off',

        '@typescript-eslint/member-ordering': [
            'warn',
            {
              'default': [

                'signature',

                'public-static-field',
                'protected-static-field',
                'private-static-field',

                'public-abstract-field',
                'protected-abstract-field',
                'private-abstract-field',

                'public-instance-field',
                'protected-instance-field',
                'private-instance-field',

                'public-field',
                'protected-field',
                'private-field',

                'static-field',
                'instance-field',
                'abstract-field',

                'field',

                'constructor',

                'public-abstract-method',
                'protected-abstract-method',
                'private-abstract-method',

                'public-instance-method',
                'protected-instance-method',
                'private-instance-method',

                'public-method',
                'protected-method',
                'private-method',

                'public-static-method',
                'protected-static-method',
                'private-static-method',

                'static-method',
                'instance-method',
                'abstract-method',

                'method',
              ],
            },
        ],
        '@typescript-eslint/array-type': [
            'warn',
            {
                'default': 'array',
            },
        ],
    },
};
