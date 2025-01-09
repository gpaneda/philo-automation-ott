/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testTimeout: 60000,
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Fire TV Test Report",
      "outputPath": "./test-report.html",
      "includeFailureMsg": true,
      "includeConsoleLog": true
    }]
  ]
}; 