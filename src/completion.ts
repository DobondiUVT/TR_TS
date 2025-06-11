import { CriticalPairFinder } from "./critical";
import { Equation } from "./unify";
import { KnuthBendixOrdering } from "./knuth";
import { CriticalPair } from "./critical";
import { getTermComplexity, reduceToNormalForm, areTwoTermsEqualOrRenamed } from "./helpers";

const MAX_TERM_COMPLEXITY = 8;

export class Completion {
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