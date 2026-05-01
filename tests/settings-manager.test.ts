import { describe, expect, it } from 'vitest';
import { createGameScriptContext, loadGameScript } from './helpers/load-game-script';

type Store = Record<string, string>;

function createLocalStorageMock(initial: Store = {}) {
    const store: Store = { ...initial };

    return {
        getItem: (key: string) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
        setItem: (key: string, value: string) => {
            store[key] = String(value);
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        _dump: () => ({ ...store })
    };
}

function createSettingsContext(initialStorage: Store = {}) {
    const localStorage = createLocalStorageMock(initialStorage);
    const context = createGameScriptContext({ localStorage });

    loadGameScript(context, 'js/game/ui/settings/settings-manager.ts');

    return { context, localStorage };
}

describe('settings manager', () => {
    it('loads default settings when storage is empty', () => {
        const { context } = createSettingsContext();
        const manager = context.createSettingsManager();

        expect(manager.getSetting('volume')).toBe(0.7);
        expect(manager.getSetting('graphicsQuality')).toBe('high');
        expect(manager.getSetting('gameSpeed')).toBe(1.0);
        expect(manager.getSetting('retroMode')).toBe(false);
    });

    it('falls back to defaults when stored JSON is invalid', () => {
        const { context } = createSettingsContext({ 'politico-settings': '{bad json' });
        const manager = context.createSettingsManager();

        expect(manager.getSetting('volume')).toBe(0.7);
        expect(manager.getSetting('gameSpeed')).toBe(1.0);
    });

    it('clamps master volume and derives music/sfx values', () => {
        const { context } = createSettingsContext();
        const manager = context.createSettingsManager();

        manager.setVolume(2);
        expect(manager.getSetting('volume')).toBe(1);
        expect(manager.getSetting('musicVolume')).toBe(0.85);
        expect(manager.getSetting('sfxVolume')).toBe(1);

        manager.setVolume(-1);
        expect(manager.getSetting('volume')).toBe(0);
    });

    it('accepts only valid graphics quality values', () => {
        const { context } = createSettingsContext();
        const manager = context.createSettingsManager();

        manager.setGraphicsQuality('medium');
        expect(manager.getGraphicsQuality()).toBe('medium');

        manager.setGraphicsQuality('ultra');
        expect(manager.getGraphicsQuality()).toBe('medium');
    });

    it('clamps game speed to allowed range', () => {
        const { context } = createSettingsContext();
        const manager = context.createSettingsManager();

        manager.setGameSpeed(5);
        expect(manager.getGameSpeed()).toBe(2.0);

        manager.setGameSpeed(0.1);
        expect(manager.getGameSpeed()).toBe(0.5);
    });

    it('notifies subscribers on change and can unsubscribe', () => {
        const { context } = createSettingsContext();
        const manager = context.createSettingsManager();

        let callCount = 0;
        const callback = () => {
            callCount++;
        };

        manager.subscribe(callback);
        manager.setSetting('retroMode', true);
        expect(callCount).toBe(1);

        manager.unsubscribe(callback);
        manager.setSetting('retroMode', false);
        expect(callCount).toBe(1);
    });

    it('saves settings to localStorage', () => {
        const { context, localStorage } = createSettingsContext();
        const manager = context.createSettingsManager();

        manager.setSetting('retroMode', true);

        const saved = localStorage._dump()['politico-settings'];
        expect(saved).toBeTruthy();
        expect(saved).toContain('"retroMode":true');
    });
});
