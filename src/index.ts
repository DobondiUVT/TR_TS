import { CriticalPairFinder } from "./critical";
import { Parser } from "./parser";
import { Equation } from "./unify";
        
const rules: Equation[] = [
    { left: new Parser("f(f(x))").parse(), right: new Parser("g(x)").parse() },
];

const cpf = new CriticalPairFinder(rules);
const pairs = cpf.findCriticalPairs();

pairs.forEach((pair, i) => {
    console.log(`Critical Pair ${i + 1}:`);
    console.log(`Overlap at position: ${pair.overlapPosition.join(',')}`);
    console.log(`Overlap term: ${pair.overlapTerm.toString()}`);
    console.log(`Substitution: ${pair.substitution.toString()}`);
    console.log(`Rule 1: ${pair.rule1.left.toString()} =? ${pair.rule1.right.toString()}`);
    console.log(`Rule 2: ${pair.rule2.left.toString()} =? ${pair.rule2.right.toString()}`);
    console.log(`<${pair.criticalPair[0].toString()}, ${pair.criticalPair[1].toString()}>\n`);
});