import { Term } from './term';


export class Substitution {
    private map: Map<string, Term>;

    constructor() {
        this.map = new Map();
    }

    set(key: string, value: Term): void {
        this.map.set(key, value);
    }

    get(key: string): Term | undefined {
        return this.map.get(key);
    }

    has(key: string): boolean {
        return this.map.has(key);
    }

    get size(): number {
        return this.map.size;
    }

    entries(): IterableIterator<[string, Term]> {
        return this.map.entries();
    }

    toString(): string {
        if (this.size === 0) return '{}';
        return '{' + Array.from(this.entries())
            .map(([k, v]) => `${k} → ${v.toString()}`)
            .join(', ') + '}';
    }
}
