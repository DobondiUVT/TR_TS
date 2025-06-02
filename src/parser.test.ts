import { Parser } from './parser';

describe('Parser', () => {
    describe('valid inputs', () => {
        test('parses simple constant', () => {
            const parser = new Parser('a');
            const term = parser.parse();
            expect(term.isConstant).toBe(true);
            expect(term.name).toBe('a');
        });

        test('parses variable with number', () => {
            const parser = new Parser('x1');
            const term = parser.parse();
            expect(term.isVariable).toBe(true);
            expect(term.name).toBe('x1');
        });

        test('parses function with one argument', () => {
            const parser = new Parser('i(a)');
            const term = parser.parse();
            expect(term.isFunction).toBe(true);
            expect(term.name).toBe('i');
            expect(term.args).toHaveLength(1);
            expect(term.args[0].isConstant).toBe(true);
            expect(term.args[0].name).toBe('a');
        });

        test('parses function with two arguments', () => {
            const parser = new Parser('f(a,b)');
            const term = parser.parse();
            expect(term.isFunction).toBe(true);
            expect(term.name).toBe('f');
            expect(term.args).toHaveLength(2);
            expect(term.args[0].isConstant).toBe(true);
            expect(term.args[0].name).toBe('a');
            expect(term.args[1].isConstant).toBe(true);
            expect(term.args[1].name).toBe('b');
        });

        test('parses nested function calls', () => {
            const parser = new Parser('f(i(a),b)');
            const term = parser.parse();
            expect(term.isFunction).toBe(true);
            expect(term.name).toBe('f');
            expect(term.args).toHaveLength(2);
            expect(term.args[0].isFunction).toBe(true);
            expect(term.args[0].name).toBe('i');
            expect(term.args[0].args[0].isConstant).toBe(true);
            expect(term.args[0].args[0].name).toBe('a');
            expect(term.args[1].isConstant).toBe(true);
            expect(term.args[1].name).toBe('b');
        });

        test('handles whitespace', () => {
            const parser = new Parser('f( a , b )');
            const term = parser.parse();
            expect(term.isFunction).toBe(true);
            expect(term.name).toBe('f');
            expect(term.args).toHaveLength(2);
            expect(term.args[0].name).toBe('a');
            expect(term.args[1].name).toBe('b');
        });
    });

    describe('invalid inputs', () => {
        test('throws on invalid function name', () => {
            const parser = new Parser('h(a)');
            expect(() => parser.parse()).toThrow('Unexpected character: h');
        });

        test('throws on missing opening parenthesis', () => {
            const parser = new Parser('fa,b)');
            expect(() => parser.parse()).toThrow("Expected '(' after function name f");
        });

        test('throws on missing closing parenthesis', () => {
            const parser = new Parser('f(a,b');
            expect(() => parser.parse()).toThrow('Unexpected characters after term: ');
        });

        test('throws on invalid constant', () => {
            const parser = new Parser('d');
            expect(() => parser.parse()).toThrow('Unexpected character: d');
        });

        test('throws on invalid variable', () => {
            const parser = new Parser('w1');
            expect(() => parser.parse()).toThrow('Unexpected character: w');
        });

        test('throws on invalid syntax in function arguments', () => {
            const parser = new Parser('f(a;b)');
            expect(() => parser.parse()).toThrow("Expected ',' or ')' but got ;");
        });

        test('throws on extra characters after term', () => {
            const parser = new Parser('f(a,b)c');
            expect(() => parser.parse()).toThrow('Unexpected characters after term: c');
        });
    });
}); 