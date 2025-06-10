import { Term } from "../term";
import { Equation } from "../unify";
import { CriticalPairFinder, CriticalPair } from "../critical";
import { areTwoTermsEqualOrRenamed, applySubstitution, reduceToNormalForm } from "../helpers";
import { KnuthBendixOrdering } from "../knuth";

export class HuetCompletion {
    private rules: Equation[];
    private criticalPairFinder: CriticalPairFinder;
    private rulesAnalyzed: Set<string>;

    constructor(initialRules: Equation[]) {
        this.rules = [...initialRules];
        this.criticalPairFinder = new CriticalPairFinder(this.rules);
        this.rulesAnalyzed = new Set<string>();
    }

    private orientEquation(eq: Equation): Equation {
        const order = KnuthBendixOrdering.compare(eq.left, eq.right);
        if (order > 0) {
            return eq;
        }
        return { left: eq.right, right: eq.left };
    }

    private trivialReduce(equation: Equation): Equation {
        for (const rule of this.rules) {
            const [unified, substitution] = areTwoTermsEqualOrRenamed(rule.left, equation.left);
            if (unified) {
                return { left: applySubstitution(rule.right, substitution), right: equation.right };
            }
        }    
        return equation;
    }
    
    private processCriticalPair(pair: CriticalPair): void {
        const [left, right] = pair.criticalPair;
        // simplify
        // console.log("Found term with critical pairs: " + pair.termWithCriticalPairs.toString() + " with overlap term " + pair.overlapTerm.toString() + " between rule " + pair.rule1.left.toString() + " and " + pair.rule2.left.toString());
        // console.log(`Processing critical pair: <${left.toString()}, ${right.toString()}> with substitution ${pair.substitution.toString()}`);
        // console.log("\n");
        const { left: left_, right: right_ } = this.trivialReduce({ left, right });
        const oriented = this.orientEquation({ left: left_, right: right_ });
        const orientedFull = this.orientEquation({ left: left, right: right });
        this.rules.push(oriented);
        // this.rules.push(orientedFull);
        this.rulesAnalyzed.add(left_.toString());
    }

    public complete(): Equation[] {
        let iterations = 0;
        let max_iterations = 1;
        while (iterations < max_iterations) {
            const criticalPairs = this.criticalPairFinder.findCriticalPairs();
            if (criticalPairs.length === 0) break;

            for (const pair of criticalPairs) {
                if (this.rulesAnalyzed.has(pair.criticalPair[0].toString())) {
                    // console.log(`Skipping analyzed critical pair: <${pair.criticalPair[0].toString()}, ${pair.criticalPair[1].toString()}>`);
                    continue;
                }
                this.processCriticalPair(pair);
                this.rulesAnalyzed.add(pair.criticalPair[0].toString());
            }
            
            // Update the critical pair finder with the new rules
            this.criticalPairFinder = new CriticalPairFinder(this.rules);
            iterations++;
        }
        
        return this.rules;
    }

    public checkIfRulesContainSystem(system: Equation[]): void {
        for (const sysRule of system) {
            if (this.rules.some(rule => rule.left.toString() === sysRule.left.toString() && rule.right.toString() === sysRule.right.toString())) {
                console.log(`Rule ${sysRule.left.toString()} -> ${sysRule.right.toString()} ✅`);
            } else {
                console.log(`Rule ${sysRule.left.toString()} -> ${sysRule.right.toString()} ❌`);
            }
        }
    }
}

// Example usage
const equations: Equation[] = [
    {
        left: Term.create('*', [Term.create('*', [Term.create('x'), Term.create('y')]), Term.create('z')]),
        right: Term.create('*', [Term.create('x'), Term.create('*', [Term.create('y'), Term.create('z')])])
    },
    {
        left: Term.create('*', [Term.create('i', [Term.create('x')]), Term.create('x')]),
        right: Term.create('1')
    },
    {
        left: Term.create('*', [Term.create('1'), Term.create('x')]),
        right: Term.create('x')
    },
];

const system: Equation[] = [
    {
        left: Term.create('*', [Term.create('*', [Term.create('x'), Term.create('y')]), Term.create('z')]),
        right: Term.create('*', [Term.create('x'), Term.create('*', [Term.create('y'), Term.create('z')])])
    },
    {
        left: Term.create('*', [Term.create('1'), Term.create('x')]),
        right: Term.create('x')
    },
    {
        left: Term.create('*', [Term.create('x'), Term.create('1')]),
        right: Term.create('x')
    },
    {
        left: Term.create('*', [Term.create('x'), Term.create('i', [Term.create('x')])]),
        right: Term.create('1')
    },
    {
        left: Term.create('*', [Term.create('i', [Term.create('x')]), Term.create('x')]),
        right: Term.create('1')
    },
    {
        left: Term.create('i', [Term.create('1')]),
        right: Term.create('1')
    },
    {
        left: Term.create('i', [Term.create('i', [Term.create('x')])]),
        right: Term.create('x')
    },
    {
        left: Term.create('i', [Term.create('*', [Term.create('x'), Term.create('y')])]),
        right: Term.create('*', [Term.create('i', [Term.create('y')]), Term.create('i', [Term.create('x')])])
    },
    {
        left: Term.create('*', [Term.create('x'), Term.create('*', [Term.create('i', [Term.create('x')]), Term.create('y')])]),
        right: Term.create('y')
    },
    {
        left: Term.create('*', [Term.create('i', [Term.create('x')]), Term.create('*', [Term.create('x'), Term.create('y')])]),
        right: Term.create('y')
    },
];

// Create and run the completion procedure
const huet = new HuetCompletion(equations);
const completedRules = huet.complete();
// console.log('Completed rules:', completedRules.map(eq => eq.left.toString() + ' -> ' + eq.right.toString()));
huet.checkIfRulesContainSystem(system);


