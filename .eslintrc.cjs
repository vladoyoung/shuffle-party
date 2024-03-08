/* eslint-env node */
module.exports = {
    extends: ['plugin:svelte/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'], // This is a required setting in `@typescript-eslint/parser` v4.24.0.
    },
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: {
                    ts: '@typescript-eslint/parser',
                    js: 'espree',
                    typescript: '@typescript-eslint/parser',
                },
            },
        },
    ],
}
