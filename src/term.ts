import { TERM_RULES, ORDERING_RULES } from "./config";

export abstract class Term {
    constructor(public readonly name: string, public readonly args: Term[] = []) {}

    abstract get isConstant(): boolean;
    abstract get isVariable(): boolean;
    abstract get isFunction(): boolean;
    abstract toString(parentPrecedence?: number): string;

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

    toString(parentPrecedence = 0): string {
        const funcDef = TERM_RULES.functions[this.name as keyof typeof TERM_RULES.functions];
        // @ts-ignore
        const precedence = ORDERING_RULES.precedence[this.name];

        if ('infix' in funcDef && funcDef.infix) {
            const leftStr = this.args[0].toString(precedence);
            const rightStr = this.args[1].toString(precedence + 1); // For left-associativity
            const s = `${leftStr} ${this.name} ${rightStr}`;
            
            if (precedence <= parentPrecedence) {
                return `(${s})`;
            }
            return s;
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

    toString(parentPrecedence = 0): string {
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

    toString(parentPrecedence = 0): string {
        return this.name;
    }
}