import { describe, expect, it } from 'vitest';
import { createGameScriptContext, loadGameScript } from './helpers/load-game-script';

describe('createFpsSampler', () => {
    it('does not emit a sample before the sample window', () => {
        const context = createGameScriptContext({
            performance: { now: () => 0 }
        });

        loadGameScript(context, 'js/debug/fps-sampler.ts');

        const sampler = context.createFpsSampler(1000);
        expect(sampler.tick(100)).toBeNull();
        expect(sampler.tick(999)).toBeNull();
    });

    it('emits fps and timing data once window threshold is crossed', () => {
        const context = createGameScriptContext({
            performance: { now: () => 0 }
        });

        loadGameScript(context, 'js/debug/fps-sampler.ts');

        const sampler = context.createFpsSampler(1000);
        sampler.tick(500);
        const sample = sampler.tick(1000);

        expect(sample).not.toBeNull();
        expect(sample.fps).toBe(2);
        expect(sample.frameMs).toBe(500);
        expect(sample.maxFrameMs).toBe(500);
    });
});
