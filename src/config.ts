export const CONFIG = {
    constantsRegex: /^[abc01]$/,
    variablesRegex: /^[xyz](\d+)?$/,
    functions: {
        "f": 2,
        "g": 1,
    },
} as const;