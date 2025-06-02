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
            if (eq.left.isVariable && !this.containsVariable(eq.right, eq.left.name)) {
                // Substitute everywhere
                this.substitution.set(eq.left.name, eq.right);
                const newEquations = equations
                    .filter((_, idx) => idx !== i)
                    .map(eq2 => ({
                        left: applySubstitution(eq2.left, this.substitution),
                        right: applySubstitution(eq2.right, this.substitution)
                    }));
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

    private tryDelete(equations: Equation[]): Equation[] | null {
        for (let i = 0; i < equations.length; i++) {
            const eq = equations[i];
            if (eq.left.toString() === eq.right.toString()) {
                const newEquations = equations.filter((_, idx) => idx !== i);
                this.addStep('Delete', equations, eq, newEquations);
                return newEquations;
            }
        }
        return null;
    }

    private tryOrient(equations: Equation[]): Equation[] | null {
        for (let i = 0; i < equations.length; i++) {
            const eq = equations[i];
            if (!eq.left.isVariable && eq.right.isVariable) {
                const newEquations = [
                    ...equations.slice(0, i),
                    { left: eq.right, right: eq.left },
                    ...equations.slice(i + 1)
                ];
                this.addStep('Orient', equations, eq, newEquations);
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
        while (true) {
            let result: Equation[] | null = null;
            // Apply rules in the order: Eliminate, Decompose, Delete, Orient
            result = this.tryEliminate(current);
            if (result) { current = result; continue; }
            result = this.tryDecompose(current);
            if (result) { current = result; continue; }
            result = this.tryDelete(current);
            if (result) { current = result; continue; }
            result = this.tryOrient(current);
            if (result) { current = result; continue; }
            break;
        }
        return this.isSolvedForm(current);
    }

    getSteps(): UnificationStep[] {
        return this.steps;
    }

    getSubstitution(): Substitution {
        return this.substitution;
    }

    printSteps(): void {
        console.log("Unification Steps:");
        this.steps.forEach((step, index) => {
            console.log(`\nStep ${index + 1}:`);
            console.log(`Rule: ${step.rule}`);
            console.log(`Before: ${step.before}`);
            console.log(`Applied to: ${step.equation}`);
            console.log(`After: ${step.after}`);
            if (step.substitution && step.substitution.size > 0) {
                console.log("Substitution:",
                    Array.from(step.substitution.entries())
                        .map(([k, v]) => `${k} → ${v.toString()}`)
                        .join(", ")
                );
            }
        });
    }
} 