import { Term } from "../term";
import { Equation } from "../unify";
import { CriticalPairFinder, CriticalPair } from "../critical";
import { areTwoTermsEqualOrRenamed, applySubstitution, reduceToNormalForm, getTermComplexity } from "../helpers";
import { KnuthBendixOrdering } from "../knuth";
import * as fs from 'fs';

const MAX_TERM_COMPLEXITY = 8;

export class HuetCompletion {
    private rules: Equation[];
    private criticalPairFinder: CriticalPairFinder;
    private rulesAnalyzed: Set<string>;

    constructor(initialRules: Equation[]) {
        this.rules = [...initialRules].map(this.orientEquation);
        this.simplifyRuleSet();
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

    private fullyReduce(equation: Equation): Equation {
        return {
            left: reduceToNormalForm(equation.left, this.rules),
            right: reduceToNormalForm(equation.right, this.rules)
        };
    }

    private isDuplicateRule(newRule: Equation): boolean {
        return this.rules.some(rule => 
            rule.left.toString() === newRule.left.toString() && 
            rule.right.toString() === newRule.right.toString()
        );
    }

    private isEquivalentRule(newRule: Equation): boolean {
        // Check if rule is equivalent to existing ones (considering variable renaming)
        for (const rule of this.rules) {
            const [unified1, _] = areTwoTermsEqualOrRenamed(rule.left, newRule.left);
            const [unified2, __] = areTwoTermsEqualOrRenamed(rule.right, newRule.right);
            if (unified1 && unified2) {
                return true;
            }
            // Also check reverse orientation
            const [unified3, ___] = areTwoTermsEqualOrRenamed(rule.left, newRule.right);
            const [unified4, ____] = areTwoTermsEqualOrRenamed(rule.right, newRule.left);
            if (unified3 && unified4) {
                return true;
            }
        }
        return false;
    }
    
    private processCriticalPair(pair: CriticalPair): boolean {
        const [left, right] = pair.criticalPair;
        
        const reduced = this.fullyReduce({ left, right });
        
        if (reduced.left.toString() === reduced.right.toString()) {
            return false;
        }
        
        const oriented = this.orientEquation(reduced);
        
        const complexity = Math.max(getTermComplexity(oriented.left), getTermComplexity(oriented.right));
        if (complexity > MAX_TERM_COMPLEXITY) {
            console.log(`Rule too complex (complexity ${complexity}), skipping: ${oriented.left.toString()} -> ${oriented.right.toString()}`);
            return false;
        }

        if (this.isDuplicateRule(oriented) || this.isEquivalentRule(oriented)) {
            return false;
        }
        
        this.rules.push(oriented);
        console.log(`New rule added: ${oriented.left.toString()} -> ${oriented.right.toString()}`);
        return true;
    }

    private simplifyRuleSet() {
        let changed = true;
        while (changed) {
            changed = false;
            const newRules: Equation[] = [];
            const ruleSetSize = this.rules.length;

            for (let i = 0; i < ruleSetSize; i++) {
                let rule = this.rules[i];
                const otherRules = [...this.rules.slice(0, i), ...this.rules.slice(i + 1)];
                
                let simplifiedLeft = reduceToNormalForm(rule.left, otherRules);
                let simplifiedRight = reduceToNormalForm(rule.right, otherRules);

                if (rule.left.toString() !== simplifiedLeft.toString() || rule.right.toString() !== simplifiedRight.toString()) {
                    changed = true;
                }

                if (simplifiedLeft.toString() === simplifiedRight.toString()) {
                    // Rule is redundant
                    continue;
                }
                
                let newRule = this.orientEquation({ left: simplifiedLeft, right: simplifiedRight });
                
                // Final check to prevent adding duplicates in this simplification pass
                if (!newRules.some(r => r.left.toString() === newRule.left.toString() && r.right.toString() === newRule.right.toString())) {
                    newRules.push(newRule);
                }
            }

            if (changed) {
                this.rules = newRules;
            }
        }
    }

    public complete(): Equation[] {
        let iterations = 0;
        const max_iterations = 20; // Increased iterations for this strategy
        
        console.log(`Starting completion with ${this.rules.length} initial rules.`);
        
        while (iterations < max_iterations) {
            iterations++;
            console.log(`\n--- Iteration ${iterations} ---`);
            
            const criticalPairs = this.criticalPairFinder.findCriticalPairs();
            if (criticalPairs.length === 0) {
                console.log("No more critical pairs. Completion finished.");
                break;
            }
            
            console.log(`Found ${criticalPairs.length} critical pairs. Current rules: ${this.rules.length}`);

            let newRulesAddedInIteration = false;
            for (const pair of criticalPairs) {
                const pairKey = `${pair.criticalPair[0].toString()}_${pair.criticalPair[1].toString()}`;
                if (this.rulesAnalyzed.has(pairKey)) continue;

                if (this.processCriticalPair(pair)) {
                    newRulesAddedInIteration = true;
                    // Simplify the entire rule set with the new rule immediately
                    this.simplifyRuleSet();
                    // Since rules have changed, we need to restart with new critical pairs
                    this.criticalPairFinder = new CriticalPairFinder(this.rules);
                    break; 
                }
                this.rulesAnalyzed.add(pairKey);
            }

            // If a new rule was added and we simplified, we loop again.
            // If no new rules were added from all critical pairs, we are done.
            if (!newRulesAddedInIteration) {
                console.log("No new rules generated from critical pairs. Completion finished.");
                break;
            }
        }
        
        if (iterations >= max_iterations) {
            console.log(`\nCompletion terminated after maximum iterations (${max_iterations})`);
        } else {
            console.log(`\nCompletion successful after ${iterations} iterations`);
        }
        
        console.log(`Final rule set contains ${this.rules.length} rules`);
        return this.rules;
    }

    public checkIfRulesContainSystem(system: Equation[]): void {
        console.log("\n--- Checking System Coverage ---");
        for (const sysRule of system) {
            const leftNormal = reduceToNormalForm(sysRule.left, this.rules);
            const rightNormal = reduceToNormalForm(sysRule.right, this.rules);

            if (leftNormal.toString() === rightNormal.toString()) {
                console.log(`Rule ${sysRule.left.toString()} -> ${sysRule.right.toString()} ✅`);
            } else {
                console.log(`Rule ${sysRule.left.toString()} -> ${sysRule.right.toString()} ❌`);
                console.log(`   ${sysRule.left.toString()} reduces to ${leftNormal.toString()}`);
                console.log(`   ${sysRule.right.toString()} reduces to ${rightNormal.toString()}`);
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

function toCanonicalRuleString(rule: Equation): string {
    const varMap = new Map<string, string>();
    let varCount = 0;

    function canonicalizeTerm(term: Term): string {
        if (term.isVariable) {
            if (!varMap.has(term.name)) {
                varMap.set(term.name, `v${varCount++}`);
            }
            return varMap.get(term.name)!;
        }
        if (term.isConstant) {
            return term.name;
        }
        if (term.isFunction) {
            return `${term.name}(${term.args.map(canonicalizeTerm).join(', ')})`;
        }
        return '';
    }
    
    const left = canonicalizeTerm(rule.left);
    varMap.clear();
    varCount = 0;
    const right = canonicalizeTerm(rule.right);
    
    return `${left} -> ${right}`;
}

// --- Write to file ---
try {
    const canonicalSystemRules = new Set(system.map(rule => {
        // Add both normal and inverse canonical forms
        const normal = toCanonicalRuleString(rule);
        const inverse = toCanonicalRuleString({ left: rule.right, right: rule.left });
        return [normal, inverse];
    }).flat());

    let fileOutput = "# Completed Rule System\n\n";

    const uniqueRules = completedRules.filter((rule, index, self) =>
        index === self.findIndex((r) => (
            r.left.toString() === rule.left.toString() && r.right.toString() === rule.right.toString()
        ))
    );

    for (const rule of uniqueRules) {
        const ruleString = `${rule.left.toString()} -> ${rule.right.toString()}`;
        const canonicalRule = toCanonicalRuleString(rule);
        const checkmark = canonicalSystemRules.has(canonicalRule) ? ' ✅' : '';
        fileOutput += `${ruleString}${checkmark}\n`;
    }

    fs.writeFileSync('completed_system.txt', fileOutput);
    console.log('\nSuccessfully wrote the completed system to completed_system.txt');
} catch (error) {
    console.error('\nFailed to write system to file:', error);
}



