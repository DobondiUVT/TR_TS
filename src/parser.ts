import { TERM_RULES } from './config';
import { Term } from './term';

export class Parser {
    private pos: number = 0;
    private input: string;

    constructor(input: string) {
        this.input = input.replace(/\s+/g, '');
    }

    private peek(): string {
        return this.input[this.pos];
    }

    private advance(): string {
        return this.input[this.pos++];
    }

    private isEnd(): boolean {
        return this.pos >= this.input.length;
    }

    private parseFunctionCall(): Term {
        const name = this.advance();
        if (!(name in TERM_RULES.functions)) {
            throw new Error(`Invalid function name: ${name}`);
        }

        if (this.advance() !== '(') {
            throw new Error(`Expected '(' after function name ${name}`);
        }

        const args: Term[] = [];
        while (true) {
            args.push(this.parseTerm());
            
            const next = this.peek();
            if (next === ')') {
                this.advance();
                break;
            }
            if (next === ',') {
                this.advance();
                continue;
            }
            if (this.isEnd()) {
                throw new Error(`Unexpected characters after term: `);
            }
            throw new Error(`Expected ',' or ')' but got ${next}`);
        }

        return Term.create(name, args);
    }

    private parseVariable(): Term {
        let varName = this.advance();
        while (!this.isEnd() && /^\d$/.test(this.peek())) {
            varName += this.advance();
        }
        if (!TERM_RULES.variablesRegex.test(varName)) {
            throw new Error(`Invalid variable name: ${varName}`);
        }
        return Term.create(varName);
    }

    private parseTerm(): Term {
        const char = this.peek();
        
        if (TERM_RULES.constantsRegex.test(char)) {
            return Term.create(this.advance());
        }
        if (TERM_RULES.variablesRegex.test(char)) {
            return this.parseVariable();
        }
        if (char in TERM_RULES.functions) {
            return this.parseFunctionCall();
        }
        
        throw new Error(`Unexpected character: ${char}`);
    }

    parse(): Term {
        const term = this.parseTerm();
        if (!this.isEnd()) {
            throw new Error(`Unexpected characters after term: ${this.input.slice(this.pos)}`);
        }
        return term;
    }
}