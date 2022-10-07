/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  rootDir: 'src',
  moduleNameMapper: {
    "\\.scss$": 'identity-obj-proxy',
  }
};
