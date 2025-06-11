import { applySubstitution } from './helpers';
import { Substitution } from './substitution';
import { Term } from './term';

export interface Equation {
    left: Term;
    right: Term;
}

interface UnificationStep {
    rule: 'Delete' | 'Orient' | 'Decompose' | 'Eliminate';
    before: string;
    equation: string;
    after: string;
    substitution?: Substitution;
}

export class Unifier {
    private steps: UnificationStep[] = [];
    private substitution: Substitution = new Substitution();

    constructor(private equations: Equation[]) {}

    private isSolvedForm(equations: Equation[]): boolean {
        const variables = new Set<string>();
        for (const eq of equations) {
            if (!eq.left.isVariable) return false;
            if (variables.has(eq.left.name)) return false;
            variables.add(eq.left.name);
            if (this.containsVariable(eq.right, eq.left.name)) return false;
        }
        return true;
    }

    private addStep(rule: UnificationStep['rule'], before: Equation[], equation: Equation, after: Equation[]) {
        this.steps.push({
            rule,
            before: this.equationsToString(before),
            equation: this.equationToString(equation),
            after: this.equationsToString(after),
            substitution: new Substitution()
        });
    }

    private equationsToString(eqs: Equation[]): string {
        if (eqs.length === 0) return '{}';
        return '{' + eqs.map(eq => this.equationToString(eq)).join(', ') + '}';
    }
    private equationToString(eq: Equation): string {
        return eq.left.toString() + ' =? ' + eq.right.toString();
    }

    private tryEliminate(equations: Equation[]): Equation[] | null {
        for (let i = 0; i < equations.length; i++) {
            const eq = equations[i];
            
            // Orient if necessary, so we have a variable on the left
            if (!eq.left.isVariable && eq.right.isVariable) {
                const temp = eq.left;
                eq.left = eq.right;
                eq.right = temp;
            }

            if (eq.left.isVariable) {
                if (this.containsVariable(eq.right, eq.left.name)) {
                    continue; 
                }

                const s: Substitution = new Substitution();
                s.set(eq.left.name, eq.right);

                // Substitute everywhere else, including the rest of the equations
                const otherEquations = equations.filter((_, idx) => idx !== i);
                const newEquations = otherEquations.map(otherEq => ({
                    left: applySubstitution(otherEq.left, s),
                    right: applySubstitution(otherEq.right, s)
                }));
                
                // Also apply substitution to our own substitution map
                for (const [key, value] of this.substitution.entries()) {
                    this.substitution.set(key, applySubstitution(value, s));
                }
                
                this.substitution.set(eq.left.name, eq.right);
                
                this.addStep('Eliminate', equations, eq, newEquations);
                return newEquations;
            }
        }
        return null;
    }

    private tryDecompose(equations: Equation[]): Equation[] | null {
        for (let i = 0; i < equations.length; i++) {
            const eq = equations[i];
            if (eq.left.isFunction && eq.right.isFunction &&
                eq.left.name === eq.right.name &&
                eq.left.args.length === eq.right.args.length) {
                const newEquations = [
                    ...equations.slice(0, i),
                    ...eq.left.args.map((arg, idx) => ({
                        left: arg,
                        right: eq.right.args[idx]
                    })),
                    ...equations.slice(i + 1)
                ];
                this.addStep('Decompose', equations, eq, newEquations);
                return newEquations;
            }
        }
        return null;
    }

    private containsVariable(term: Term, varName: string): boolean {
        if (term.isVariable) {
            return term.name === varName;
        }
        if (term.isFunction) {
            return term.args.some(arg => this.containsVariable(arg, varName));
        }
        return false;
    }

    unify(): boolean {
        let current = [...this.equations];
        while (current.length > 0) {
            let changed = false;
            
            // Rule 1: Delete
            const initialLength = current.length;
            current = current.filter(eq => eq.left.toString() !== eq.right.toString());
            if (current.length < initialLength) changed = true;
            
            // Rule 2: Decompose
            const decomposed = this.tryDecompose(current);
            if (decomposed) {
                current = decomposed;
                changed = true;
            }

            // Rule 3: Orient
            current.forEach(eq => {
                if (!eq.left.isVariable && eq.right.isVariable) {
                    const temp = eq.left;
                    eq.left = eq.right;
                    eq.right = temp;
                    changed = true;
                }
            });

            // Rule 4: Eliminate
            const eliminated = this.tryEliminate(current);
            if (eliminated) {
                current = eliminated;
                changed = true;
            }

            if (!changed) break; // No more rules applied, exit loop.
        }
        
        // Final check for solved form and update substitution
        if (this.isSolvedForm(current)) {
            current.forEach(eq => {
                if (eq.left.isVariable) {
                    this.substitution.set(eq.left.name, eq.right);
                }
            });
            return true;
        }

        return false;
    }

    getSteps(): UnificationStep[] {
        return this.steps;
    }

    getSubstitution(): Substitution {
        return this.substitution;
    }
} 