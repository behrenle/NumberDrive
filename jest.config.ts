export default {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  }
};
