import { CONFIG } from "./config";

export abstract class Term {
    constructor(public readonly name: string, public readonly args: Term[] = []) {}

    abstract get isConstant(): boolean;
    abstract get isVariable(): boolean;
    abstract get isFunction(): boolean;
    abstract toString(): string;

    static create(name: string, args: Term[] = []): Term {
        if (CONFIG.constantsRegex.test(name)) {
            return new ConstantTerm(name);
        }
        if (CONFIG.variablesRegex.test(name)) {
            return new VariableTerm(name);
        }
        if (name in CONFIG.functions) {
            return new FunctionTerm(name as keyof typeof CONFIG.functions, args);
        }
        throw new Error(`Invalid term name: ${name}`);
    }
}

export class FunctionTerm extends Term {
    constructor(
        name: keyof typeof CONFIG.functions,
        args: Term[]
    ) {
        super(name, args);
        if (!(name in CONFIG.functions)) {
            throw new Error(`Invalid function name: ${name}`);
        }
        if (CONFIG.functions[name] !== args.length) {
            throw new Error(`Invalid number of arguments for function ${name}`);
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
        return `${this.name}(${this.args.map(arg => arg.toString()).join(', ')})`;
    }
}

export class VariableTerm extends Term {
    constructor(name: string) {
        super(name);
        if (!CONFIG.variablesRegex.test(name)) {
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
        if (!CONFIG.constantsRegex.test(name)) {
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