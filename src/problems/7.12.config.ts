import { Parser } from "../parser";
import { Equation } from "../unify";

export const initialAxioms: Equation[] = [
    {
        left: new Parser('(x * y) * z').parse(),
        right: new Parser('x * (y * z)').parse()
    },
    {
        left: new Parser('i(x) * x').parse(),
        right: new Parser('1').parse()
    },
    {
        left: new Parser('1 * x').parse(),
        right: new Parser('x').parse()
    },
];

export const convergentSystem: Equation[] = [
    {
        left: new Parser('(x * y) * z').parse(),
        right: new Parser('x * (y * z)').parse()
    },
    {
        left: new Parser('1 * x').parse(),
        right: new Parser('x').parse()
    },
    {
        left: new Parser('x * 1').parse(),
        right: new Parser('x').parse()
    },
    {
        left: new Parser('x * i(x)').parse(),
        right: new Parser('1').parse()
    },
    {
        left: new Parser('i(x) * x').parse(),
        right: new Parser('1').parse()
    },
    {
        left: new Parser('i(1)').parse(),
        right: new Parser('1').parse()
    },
    {
        left: new Parser('i(i(x))').parse(),
        right: new Parser('x').parse()
    },
    {
        left: new Parser('i(x * y)').parse(),
        right: new Parser('i(y) * i(x)').parse()
    },
    {
        left: new Parser('x * (i(x) * y)').parse(),
        right: new Parser('y').parse()
    },
    {
        left: new Parser('i(x) * (x * y)').parse(),
        right: new Parser('y').parse()
    },
];