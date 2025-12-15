module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    globals: {
      'ts-jest': {
        diagnostics: true,
        tsconfig: {
          strict: true
        }
      }
    }
  };
  