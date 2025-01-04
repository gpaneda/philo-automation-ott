module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.ts']
}; 