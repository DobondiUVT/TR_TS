import { Substitution } from "./substitution";
import { Term, VariableTerm } from "./term";

// Helper: Collect all variable names in a term
function collectVariables(term: Term, vars = new Set<string>()) {
    if (term.isVariable) vars.add(term.name);
    if (term.isFunction) term.args.forEach(arg => collectVariables(arg, vars));
    return vars;
}

// Helper: Rename all variables in a term to avoid conflicts
function renameVariables(term: Term, avoid: Set<string>, mapping: Map<string, string> = new Map()): Term {
    if (term.isVariable) {
        if (!mapping.has(term.name)) {
            let i = 0;
            let fresh;
            do { fresh = term.name + i; i++; } while (avoid.has(fresh));
            mapping.set(term.name, fresh);
        }
        return new VariableTerm(mapping.get(term.name)!);
    }
    if (term.isFunction) {
        return Term.create(term.name, term.args.map(arg => renameVariables(arg, avoid, mapping)));
    }
    return term;
}

// Helper: Invert a mapping
function invertMapping(mapping: Map<string, string>): Map<string, string> {
    const inv = new Map<string, string>();
    for (const [k, v] of mapping.entries()) {
        inv.set(v, k);
    }
    return inv;
}

// Helper: Revert variable renaming in a term
function revertRenaming(term: Term, invMapping: Map<string, string>): Term {
    if (term.isVariable && invMapping.has(term.name)) {
        return new VariableTerm(invMapping.get(term.name)!);
    }
    if (term.isFunction) {
        return Term.create(term.name, term.args.map(arg => revertRenaming(arg, invMapping)));
    }
    return term;
}

// Helper: Get all non-variable positions in a term
function getNonVariablePositions(term: Term, pos: number[] = []): number[][] {
    const positions: number[][] = [];
    if (!term.isVariable) {
        positions.push(pos);
        if (term.isFunction) {
            term.args.forEach((arg, i) => {
                getNonVariablePositions(arg, [...pos, i]).forEach(p => positions.push(p));
            });
        }
    }
    return positions;
}

// Helper: Get subterm at a position
function getSubtermAt(term: Term, pos: number[]): Term {
    if (pos.length === 0) return term;
    if (!term.isFunction) throw new Error('Invalid position');
    const [head, ...tail] = pos;
    return getSubtermAt(term.args[head], tail);
}

// Helper: Replace subterm at a position
function replaceSubterm(term: Term, pos: number[], replacement: Term): Term {
    if (pos.length === 0) return replacement;
    if (!term.isFunction) throw new Error('Invalid position for replacement');
    const [head, ...tail] = pos;
    const newArgs = term.args.slice();
    newArgs[head] = replaceSubterm(newArgs[head], tail, replacement);
    return Term.create(term.name, newArgs);
}

// Helper: Apply a substitution to a term
function applySubstitution(term: Term, subst: Substitution): Term {
    if (term.isVariable && subst.has(term.name)) {
        return subst.get(term.name)!;
    }
    if (term.isFunction) {
        return Term.create(term.name, term.args.map(arg => applySubstitution(arg, subst)));
    }
    return term;
}

export { collectVariables, renameVariables, invertMapping, revertRenaming, getNonVariablePositions, getSubtermAt, replaceSubterm, applySubstitution };