/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testTimeout: 60000,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: 'tsconfig.json'
    }
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports',
        filename: `${process.argv.slice(-1)[0].split('/').pop().replace('.test.ts', '')}-${new Date().toISOString().replace(/[:.]/g, '-')}.html`,
        openReport: true,
        pageTitle: 'Fire TV Automation Test Report'
      }
    ]
  ]
}; 