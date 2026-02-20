const { createConfig } = require('@openedx/frontend-base/tools');

const config = createConfig('test', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
    'src/.*\\.exp\\..*',
  ],
  moduleNameMapper: {
    // See https://stackoverflow.com/questions/72382316/jest-encountered-an-unexpected-token-react-markdown
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
    '@src/(.*)': '<rootDir>/src/$1',
    // Explicit mapping to ensure Jest resolves the module correctly
    '@edx/frontend-lib-special-exams': '<rootDir>/node_modules/@edx/frontend-lib-special-exams',
    '\\.svg$': '<rootDir>/src/__mocks__/svg.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/file.js',

  },
  testTimeout: 30000,
  globalSetup: "./global-setup.js",
  verbose: true,
  testEnvironment: 'jsdom',
});

// delete config.testURL;

config.reporters = [...(config.reporters || []), ["jest-console-group-reporter", {
  // change this setting if need to see less details for each test
  // reportType: "summary" | "details",
  // enable: true | false,
  afterEachTest: {
    enable: true,
    filePaths: false,
    reportType: "details",
  },
  afterAllTests: {
    reportType: "summary",
    enable: true,
    filePaths: true,
  },
}]];

module.exports = config;
