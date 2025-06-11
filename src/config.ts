export const TERM_RULES = {
    variablesRegex: /^[xyz](\d+)?$/,
    functions: {
        "*": { arity: 2, infix: true },
        "i": { arity: 1 },
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
        "i": 2,
      },
      constants: {
        "1": 1,
      }
    },
    precedence: {
      "1": 1,
      "*": 2,
      "i": 3,
    },
  }