import { Equation, Unifier } from './unify';
import { Term, VariableTerm } from './term';
import { Substitution } from './substitution';
import { collectVariables, renameVariables, invertMapping, revertRenaming, getNonVariablePositions, getSubtermAt, replaceSubterm, applySubstitution } from './helpers';


export interface CriticalPair {
    overlapPosition: number[];
    overlapTerm: Term;
    rule1: Equation;
    rule2: Equation;
    substitution: Substitution;
    criticalPair: [Term, Term];
}

export class CriticalPairFinder {
    constructor(private reductions: Equation[]) {}

    findCriticalPairs(): CriticalPair[] {
        const CP: CriticalPair[] = [];
        for (let i = 0; i < this.reductions.length; i++) {
            const { left: li, right: ri } = this.reductions[i];
            const vars_i = collectVariables(li);
            collectVariables(ri, vars_i);

            for (let j = 0; j < this.reductions.length; j++) {
                const { left: lj, right: rj } = this.reductions[j];
                // Only rename variables in the second rule
                const mapping = new Map<string, string>();
                const lj_ = renameVariables(lj, vars_i, mapping);
                const rj_ = renameVariables(rj, vars_i, mapping);
                const invMapping = invertMapping(mapping);

                // Get all non-variable positions in li
                const positions = getNonVariablePositions(li);

                for (const p of positions) {
                    // Skip trivial overlap (same rule, root position)
                    if (i === j && p.length === 0) continue;

                    const subterm = getSubtermAt(li, p);

                    // Try to unify subterm with lj'
                    const unifier = new Unifier([{ left: subterm, right: lj_ }]);
                    if (unifier.unify()) {
                        const subst = unifier.getSubstitution();
                        // left_side: Replace(li, p, rj'), then apply subst
                        const replaced = replaceSubterm(li, p, rj_);
                        let left_side = applySubstitution(replaced, subst);
                        // right_side: Apply subst to ri
                        let right_side = applySubstitution(ri, subst);
                        // Revert renaming in both terms
                        left_side = revertRenaming(left_side, invMapping);
                        right_side = revertRenaming(right_side, invMapping);
                        // Only add non-trivial pairs
                        if (left_side.toString() !== right_side.toString()) {
                            // Check if the reverse pair already exists
                            const exists = CP.some(pair => 
                                (pair.criticalPair[0].toString() === right_side.toString() &&
                                 pair.criticalPair[1].toString() === left_side.toString())
                            );
                            
                            if (!exists) {
                                CP.push({
                                    overlapPosition: p,
                                    overlapTerm: subterm,
                                    rule1: { left: li, right: ri },
                                    rule2: { left: lj_, right: rj_ },
                                    substitution: subst,
                                    criticalPair: [left_side, right_side],
                                });
                            }
                        }
                    }
                }
            }
        }
        return CP;
    }
} 