import { TERM_RULES, ORDERING_RULES } from './config';
import { Term } from './term';

export class Parser {
    private pos: number = 0;
    private tokens: string[];

    constructor(input: string) {
        this.tokens = this.tokenize(input);
    }

    private tokenize(input: string): string[] {
        // A simple tokenizer that handles identifiers, numbers, and symbols
        const regex = /([a-zA-Z_][\w]*|[0-9]+|[*(),])/g;
        const tokens = input.match(regex) || [];
        // console.log(`Tokens for '${input}':`, tokens);
        return tokens;
    }

    private peek(): string {
        return this.tokens[this.pos];
    }

    private advance(): string {
        return this.tokens[this.pos++];
    }

    private isEnd(): boolean {
        return this.pos >= this.tokens.length;
    }

    private getInfixPrecedence(token: string): number {
        if (!token) return 0;
        const funcDef = TERM_RULES.functions[token as keyof typeof TERM_RULES.functions];
        if (funcDef && 'infix' in funcDef && funcDef.infix) {
            return ORDERING_RULES.precedence[token as keyof typeof ORDERING_RULES.precedence] || 0;
        }
        return 0;
    }

    // NUD (Null Denotation): for variables, constants, prefix operators, parentheses
    private parseNud(): Term {
        const token = this.advance();

        if (token === '(') {
            const expr = this.parseExpression(0);
            if (this.advance() !== ')') {
                throw new Error("Expected ')' to close parenthesis group");
            }
            return expr;
        }
        
        if (token in TERM_RULES.constants) {
            return Term.create(token);
        }

        if (TERM_RULES.variablesRegex.test(token)) {
            return Term.create(token);
        }

        const funcRule = TERM_RULES.functions[token as keyof typeof TERM_RULES.functions];

        if (funcRule && (!('infix' in funcRule) || !funcRule.infix)) {
            if (this.peek() !== '(') {
                throw new Error(`Expected '(' after prefix function ${token}`);
            }
            this.advance();

            const args: Term[] = [];
            if (funcRule.arity > 0) {
                 while (true) {
                    args.push(this.parseExpression(0));
                    if (this.peek() === ')') break;
                    if (this.peek() !== ',') throw new Error(`Expected ',' or ')' in arguments of ${token}`);
                    this.advance();
                 }
            }

            if(args.length !== funcRule.arity) throw new Error(`Expected ${funcRule.arity} args for ${token}, but got ${args.length}`);
            
            if (this.advance() !== ')') {
                throw new Error(`Expected ')' to close function call for ${token}`);
            }

            return Term.create(token, args);
        }

        throw new Error(`Unexpected token: ${token}`);
    }

    // LED (Left Denotation): for infix operators
    private parseLed(left: Term): Term {
        const token = this.advance(); // The infix operator
        const precedence = this.getInfixPrecedence(token);
        const right = this.parseExpression(precedence);
        return Term.create(token, [left, right]);
    }
    
    private parseExpression(precedence: number): Term {
        let left = this.parseNud();
        while (!this.isEnd() && precedence < this.getInfixPrecedence(this.peek())) {
            left = this.parseLed(left);
        }
        return left;
    }

    parse(): Term {
        const term = this.parseExpression(0);
        if (!this.isEnd()) {
            throw new Error(`Unexpected characters after term: ${this.tokens.slice(this.pos).join(' ')}`);
        }
        return term;
    }
}