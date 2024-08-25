export default {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.mjs$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/',
    ],
    globals: {
        'babel-jest': {
            useESM: true,
        },
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
};