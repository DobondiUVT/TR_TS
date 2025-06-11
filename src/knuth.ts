import { Term, FunctionTerm } from './term';
import { ORDERING_RULES, OrderingRules } from './config';
import { Equation } from './unify';

export class KnuthBendixOrdering {
    // constructor that can take custom ordering rules
    constructor(private orderingRules: OrderingRules = ORDERING_RULES) {
    }
    
    // Calculate the weight of a term
    private calculateWeight(term: Term): number {
        if (term.isVariable) {
            return this.orderingRules.weights.variables || 1;
        }
        
        if (term.isConstant) {
            return this.orderingRules.weights.functions[term.name as keyof typeof this.orderingRules.weights.functions] || 1;
        }
        
        if (term.isFunction) {
            const functionTerm = term as FunctionTerm;
            const functionWeight = this.orderingRules.weights.functions[term.name as keyof typeof this.orderingRules.weights.functions] || 1;
            
            // Weight of function = weight of function symbol + sum of weights of arguments
            const argsWeight = functionTerm.args.reduce((sum, arg) => sum + this.calculateWeight(arg), 0);
            return functionWeight + argsWeight;
        }
        
        return 1; // fallback
    }

    // Count occurrences of each variable in a term
    private countVariables(term: Term): Map<string, number> {
        const counts = new Map<string, number>();
        
        if (term.isVariable) {
            counts.set(term.name, (counts.get(term.name) || 0) + 1);
        } else if (term.isFunction) {
            const functionTerm = term as FunctionTerm;
            for (const arg of functionTerm.args) {
                const argCounts = this.countVariables(arg);
                for (const [variable, count] of argCounts) {
                    counts.set(variable, (counts.get(variable) || 0) + count);
                }
            }
        }
        
        return counts;
    }

    // Check if variable counts of t1 are greater than or equal to t2
    private variableCondition(t1: Term, t2: Term): boolean {
        const counts1 = this.countVariables(t1);
        const counts2 = this.countVariables(t2);
        
        // For every variable in t2, t1 must have at least as many occurrences
        for (const [variable, count2] of counts2) {
            const count1 = counts1.get(variable) || 0;
            if (count1 < count2) {
                return false;
            }
        }
        
        return true;
    }

    // Compare function symbols by precedence (higher precedence = greater)
    private compareFunctionPrecedence(f1: string, f2: string): number {
        const precedence1 = this.orderingRules.precedence[f1 as keyof typeof this.orderingRules.precedence] || 0;
        const precedence2 = this.orderingRules.precedence[f2 as keyof typeof this.orderingRules.precedence] || 0;
        return precedence1 - precedence2;
    }

    // Lexicographic comparison of argument lists
    private lexicographicCompare(args1: Term[], args2: Term[]): number {
        const minLength = Math.min(args1.length, args2.length);
        
        for (let i = 0; i < minLength; i++) {
            const comparison = this.compare(args1[i], args2[i]);
            if (comparison !== 0) {
                return comparison;
            }
        }
        
        return args1.length - args2.length;
    }

    // Main KBO comparison function
    public compare(t1: Term, t2: Term): number {
        const weight1 = this.calculateWeight(t1);
        const weight2 = this.calculateWeight(t2);

        if (weight1 > weight2) {
            return this.variableCondition(t1, t2) ? 1 : 0; // t1 > t2 if vars in t2 are in t1
        }
        if (weight1 < weight2) {
            return this.variableCondition(t2, t1) ? -1 : 0; // t2 > t1 if vars in t1 are in t2
        }

        // --- Weights are equal, use precedence or lexicographic comparison ---

        // If both are functions with equal weights
        if (t1.isFunction && t2.isFunction) {
            const functionTerm1 = t1 as FunctionTerm;
            const functionTerm2 = t2 as FunctionTerm;
            
            // First compare by precedence
            const precedenceComparison = this.compareFunctionPrecedence(t1.name, t2.name);
            if (precedenceComparison !== 0) {
                return precedenceComparison;
            }
            
            // If same function symbol, compare arguments lexicographically
            if (t1.name === t2.name) {
                return this.lexicographicCompare(functionTerm1.args, functionTerm2.args);
            }
            
            return 0; // Incomparable if same weight, same precedence, different function
        }
        
        // --- Cases for equal weights involving variables or constants ---

        // If one is a variable and the other is not, the variable is greater.
        if (t1.isVariable && !t2.isVariable) return 1;
        if (!t1.isVariable && t2.isVariable) return -1;

        // If both are variables
        if (t1.isVariable && t2.isVariable) {
            return t1.name.localeCompare(t2.name);
        }
        
        // If both are constants
        if (t1.isConstant && t2.isConstant) {
            return this.compareFunctionPrecedence(t1.name, t2.name);
        }

        // Mixed cases (function vs constant with equal weights)
        if (t1.isFunction && t2.isConstant) {
            return this.compareFunctionPrecedence(t1.name, t2.name);
        }
        
        if (t1.isConstant && t2.isFunction) {
            return this.compareFunctionPrecedence(t1.name, t2.name);
        }
        
        return 0; // Equal
    }

    // Check if t1 is strictly greater than t2 in KBO
    public greaterThan(t1: Term, t2: Term): boolean {
        return this.compare(t1, t2) > 0;
    }

    // Check if t1 is strictly less than t2 in KBO
    public lessThan(t1: Term, t2: Term): boolean {
        return this.compare(t1, t2) < 0;
    }

    // Check if t1 equals t2 in KBO
    public equal(t1: Term, t2: Term): boolean {
        return this.compare(t1, t2) === 0;
    }

    public applyOrdering(equations: Equation[]): Equation[] {
        return equations.sort((a, b) => this.compare(a.left, b.left));
    }
}