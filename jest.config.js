/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  // testEnvironment: 'node',
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.(css|scss|sass|less)$', // Match all CSS file extensions
  ],
};