export const TERM_RULES = {
    variablesRegex: /^[xyz](\d+)?$/,
    functions: {
        "*": 2,
        "i": 1,
    },
    constants: {
      "1": 0,
    },
} as const;

export const ORDERING_RULES = {
    weights: {
      variables: 1,
      functions: {
        "*": 1,
        "i": 1,
      },
      constants: {
        "1": 1,
      }
    },
    precedence: {
      "i": 2,
      "*": 3,
      "1": 4,
    },
  }