import { CriticalPairFinder } from "../critical";
import { Parser } from "../parser";
import { Equation } from "../unify";

const subexercises: Record<string, () => Equation[]> = {
    "a": () => [
        { left: new Parser("f(g(f(x)))").parse(), right: new Parser("x").parse() },
        { left: new Parser("f(g(x))").parse(), right: new Parser("g(f(x))").parse() },
    ],
    "b": () => [
        { left: new Parser("+(0,y)").parse(), right: new Parser("y").parse() },
        { left: new Parser("+(x,0)").parse(), right: new Parser("x").parse() },
        { left: new Parser("+(s(x),y)").parse(), right: new Parser("s(+(x,y))").parse() },
        { left: new Parser("+(x,s(y))").parse(), right: new Parser("s(+(x,y))").parse() },
    ],
    "c": () => [
        { left: new Parser("f(x,x)").parse(), right: new Parser("a").parse() },
        { left: new Parser("f(x,g(x))").parse(), right: new Parser("b").parse() },
    ],
    "d": () => [
        { left: new Parser("f(f(x,y),z)").parse(), right: new Parser("f(x,f(y,z))").parse() },
        { left: new Parser("f(x,1)").parse(), right: new Parser("x").parse() },
    ],
    "e": () => [
        { left: new Parser("f(f(x,y),z)").parse(), right: new Parser("f(x,f(y,z))").parse() },
        { left: new Parser("f(1,x)").parse(), right: new Parser("x").parse() },
    ],
    "f": () => [
        { left: new Parser("f(x,f(y,z))").parse(), right: new Parser("f(f(x,y),f(x,z))").parse() },
        { left: new Parser("f(f(x,y),z)").parse(), right: new Parser("f(f(x,z),f(y,z))").parse() },
        { left: new Parser("f(f(x,y),f(y,z))").parse(), right: new Parser("y").parse() },
    ],
}

// solve("a");
// solve("b");
// solve("c");
// solve("d");
// solve("e");
// solve("f");

function solve(subexercise: string) {
    const cpf = new CriticalPairFinder(subexercises[subexercise]());
    const pairs = cpf.findCriticalPairs();
    pairs.forEach((pair, i) => {
        const fs = require('fs');
        const path = require('path');
        const dir = path.join(__dirname, '6.5');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        fs.appendFileSync(
            path.join(dir, `${subexercise}.txt`),
            `<${pair.criticalPair[0].toString()}, ${pair.criticalPair[1].toString()}>\n`
        );
    });
}




// const cpf = new CriticalPairFinder(rules);
// const pairs = cpf.findCriticalPairs();

// pairs.forEach((pair, i) => {
//     console.log(`Critical Pair ${i + 1}:`);
//     console.log(`Overlap at position: ${pair.overlapPosition.join(',')}`);
//     console.log(`Overlap term: ${pair.overlapTerm.toString()}`);
//     console.log(`Substitution: ${Array.from(pair.substitution.entries()).map(([k, v]) => `${k} → ${v.toString()}`).join(', ')}`);
//     console.log(`Rule 1: ${pair.rule1.left.toString()} =? ${pair.rule1.right.toString()}`);
//     console.log(`Rule 2: ${pair.rule2.left.toString()} =? ${pair.rule2.right.toString()}`);
//     console.log(`<${pair.criticalPair[0].toString()}, ${pair.criticalPair[1].toString()}>
// `);
// }); 