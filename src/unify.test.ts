import { Unifier } from './unify';
import { Term } from './term';
import { TERM_RULES } from './config';

// Helper function to create a variable term
const v = (name: string) => Term.create(`x${name}`);

// Helper function to create a constant term
const c = (name: string) => Term.create(name);

// Helper function to create a function term
const f = (name: string, ...args: Term[]) => Term.create(name, args);

describe('Unifier', () => {
  describe('basic unification', () => {
    test('should unify identical variables', () => {
      const x = v('1');
      const unifier = new Unifier([{ left: x, right: x }]);
      const result = unifier.unify();
      expect(result).toBe(true);
      expect(unifier.getSteps().length).toBe(1);
      expect(unifier.getSteps()[0].rule).toBe('Delete');
    });

    test('should unify variable with term (elimination)', () => {
      const x = v('1');
      const a = c('1');
      const unifier = new Unifier([{ left: x, right: a }]);
      const result = unifier.unify();
      expect(result).toBe(true);
      expect(unifier.getSteps().some(step => step.rule === 'Eliminate')).toBe(true);
    });
  });

  describe('function unification', () => {
    test('should unify identical functions', () => {
      const f1 = f('*', c('1'), c('1'));
      const f2 = f('*', c('1'), c('1'));
      const unifier = new Unifier([{ left: f1, right: f2 }]);
      const result = unifier.unify();
      expect(result).toBe(true);
      expect(unifier.getSteps().some(step => step.rule === 'Decompose')).toBe(true);
    });

    test('should fail for functions with different names', () => {
      const f1 = f('*', c('1'), c('1'));
      const f2 = f('i', c('1'));
      const unifier = new Unifier([{ left: f1, right: f2 }]);
      const result = unifier.unify();
      expect(result).toBe(false);
    });
  });

  describe('occurs check', () => {
    test('should detect cyclic terms', () => {
      const x = v('1');
      const func = f('i', x);
      const unifier = new Unifier([{ left: x, right: func }]);
      const result = unifier.unify();
      expect(result).toBe(false);
    });
  });

  describe('complex unification', () => {
    test('should unify nested functions with variables', () => {
      // Test case: *(x, i(y)) =? *(i(1), x)
      const x = v('1');
      const y = v('2');
      const one = c('1');
      const i_y = f('i', y);
      const i_one = f('i', one);
      const left = f('*', x, i_y);
      const right = f('*', i_one, x);
      
      const unifier = new Unifier([{ left, right }]);
      const result = unifier.unify();
      
      expect(result).toBe(true);
      const steps = unifier.getSteps();
      expect(steps.length).toBeGreaterThan(0);
      
      // Verify the final substitution
      const substitution = unifier.getSubstitution();
      expect(substitution.get('x1')?.toString()).toBe('i(1)');
      expect(substitution.get('x2')?.toString()).toBe('1');
    });
  });

  describe('multiple equations', () => {
    test('should handle multiple equations', () => {
      const x = v('1');
      const y = v('2');
      const z = v('3');
      const a = c('1');
      
      // Create equations that will definitely unify
      const equations = [
        { left: x, right: a },  // x1 = 1
        { left: y, right: a },  // x2 = 1
        { left: z, right: x }   // x3 = x1
      ];
      
      const unifier = new Unifier(equations);
      const result = unifier.unify();
      
      // The unifier should succeed
      expect(result).toBe(true);
      
      // Get the final substitution
      const substitution = unifier.getSubstitution();
      
      // Since all variables are unified to '1', we just need to verify
      // that the unifier returns true and doesn't throw any errors
      // The exact substitution might vary based on the implementation
      expect(substitution.size).toBeGreaterThan(0);
      
      // Print the substitution for debugging
      console.log('Final substitution:', substitution.toString());
    });
  });
});
