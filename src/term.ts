import { TERM_RULES } from "./config";

export abstract class Term {
    constructor(public readonly name: string, public readonly args: Term[] = []) {}

    abstract get isConstant(): boolean;
    abstract get isVariable(): boolean;
    abstract get isFunction(): boolean;
    abstract toString(): string;

    static create(name: string, args: Term[] = []): Term {
        if (name in TERM_RULES.constants) {
            return new ConstantTerm(name);
        }
        if (TERM_RULES.variablesRegex.test(name)) {
            return new VariableTerm(name);
        }
        if (name in TERM_RULES.functions) {
            return new FunctionTerm(name as keyof typeof TERM_RULES.functions, args);
        }
        throw new Error(`Invalid term name: ${name}`);
    }
}

export class FunctionTerm extends Term {
    constructor(
        name: keyof typeof TERM_RULES.functions,
        args: Term[]
    ) {
        super(name, args);
        if (!(name in TERM_RULES.functions)) {
            throw new Error(`Invalid function name: ${name}`);
        }
        if (TERM_RULES.functions[name].arity !== args.length) {
            throw new Error(`Invalid number of arguments for function ${name}, expected ${TERM_RULES.functions[name]}, got ${args.length}`);
        }
    }

    get isConstant(): boolean {
        return false;
    }

    get isVariable(): boolean {
        return false;
    }

    get isFunction(): boolean {
        return true;
    }

    toString(): string {
        if (this.name === "*") {
            return `(${this.args[0].toString()} ${this.name} ${this.args[1].toString()})`;
        }
        return `${this.name}(${this.args.map(arg => arg.toString()).join(', ')})`;
    }
}

export class VariableTerm extends Term {
    constructor(name: string) {
        super(name);
        if (!TERM_RULES.variablesRegex.test(name)) {
            throw new Error(`Invalid variable name: ${name}`);
        }
    }

    get isConstant(): boolean {
        return false;
    }

    get isVariable(): boolean {
        return true;
    }

    get isFunction(): boolean {
        return false;
    }

    toString(): string {
        return this.name;
    }
}

export class ConstantTerm extends Term {
    constructor(name: string) {
        super(name);
        if (!(name in TERM_RULES.constants)) {
            throw new Error(`Invalid constant name: ${name}`);
        }
    }

    get isConstant(): boolean {
        return true;
    }

    get isVariable(): boolean {
        return false;
    }

    get isFunction(): boolean {
        return false;
    }

    toString(): string {
        return this.name;
    }
}