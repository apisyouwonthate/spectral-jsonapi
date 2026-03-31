module.exports = async () => {
  return {
    testPathIgnorePatterns: ["__helpers__"],
    testEnvironment: "node",
    transform: {
      "^.+\\.[tj]s$": ["ts-jest", {}],
    },
  };
};
