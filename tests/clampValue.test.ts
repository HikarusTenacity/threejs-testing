import { describe, expect, it } from 'vitest';
import { createGameScriptContext, loadGameScript } from './helpers/load-game-script';

describe('clampValue', () => {
    it('returns the same value when in range', () => {
        const context = createGameScriptContext();
        loadGameScript(context, 'js/debug/clampValue.ts');

        expect(context.clampValue(5, 0, 10)).toBe(5);
    });

    it('clamps to lower bound', () => {
        const context = createGameScriptContext();
        loadGameScript(context, 'js/debug/clampValue.ts');

        expect(context.clampValue(-10, 0, 10)).toBe(0);
    });

    it('clamps to upper bound', () => {
        const context = createGameScriptContext();
        loadGameScript(context, 'js/debug/clampValue.ts');

        expect(context.clampValue(42, 0, 10)).toBe(10);
    });
});
