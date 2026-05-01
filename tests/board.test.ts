import { describe, expect, it } from 'vitest';
import { createGameScriptContext, loadGameScript } from './helpers/load-game-script';

function createBoardContext() {
    const context = createGameScriptContext();

    loadGameScript(context, 'js/game/board/board-data.ts');
    loadGameScript(context, 'js/game/board/board-layout.ts');
    loadGameScript(context, 'js/game/board/board-queries.ts');

    context.initializeBoardSpaces();
    return context;
}

describe('board layout and queries', () => {
    it('initializes all 40 spaces', () => {
        const context = createBoardContext();

        let count = 0;
        for (let i = 0; i < 40; i++) {
            const space = context.getSpaceById(i);
            expect(space).not.toBeNull();
            count++;
        }

        expect(count).toBe(40);
        expect(context.getSpaceById(-1)).toBeNull();
        expect(context.getSpaceById(40)).toBeNull();
    });

    it('maps center coordinates back to each space id', () => {
        const context = createBoardContext();

        for (let i = 0; i < 40; i++) {
            const space = context.getSpaceById(i);
            const foundId = context.getSpaceIdFromCoordinates(space.center.x, space.center.z);
            expect(foundId).toBe(i);
        }
    });

    it('returns null for out-of-board coordinates', () => {
        const context = createBoardContext();

        expect(context.getSpaceIdFromCoordinates(50, 50)).toBeNull();
        expect(context.isOnMonopolyBoard(50, 50)).toBe(false);
    });

    it('updates names only for valid spaces', () => {
        const context = createBoardContext();

        const originalName = context.getSpaceName(5);
        context.setSpaceName(5, 'Renamed');
        expect(context.getSpaceName(5)).toBe('Renamed');

        context.setSpaceName(99, 'Invalid');
        expect(context.getSpaceName(5)).not.toBe(originalName);
    });

    it('filters spaces by type', () => {
        const context = createBoardContext();

        const taxSpaces = context.getSpacesByType('TAX');
        expect(taxSpaces.length).toBeGreaterThan(0);
        for (const space of taxSpaces) {
            expect(space.type).toBe('TAX');
        }
    });
});
