function escapeDebugHtml(value: any) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function debugValueSpan(value: any, color: string) {
    return '<span style="color: ' + color + ';">' + escapeDebugHtml(value) + '</span>';
}

var DEBUG_STATS_THEMES = {
    neon: {
        fps: '#78dce8',
        frameTime: '#ffd166',
        maxFrameTime: '#ef476f',
        drawCalls: '#a6e22e',
        triangles: '#fd971f',
        geometries: '#c792ea',
        textures: '#f07178',
        gameState: '#82aaff',
        playerFallback: '#82aaff'
    },
    terminal: {
        fps: '#00ff9c',
        frameTime: '#d4ff00',
        maxFrameTime: '#ff5c8a',
        drawCalls: '#7cff6b',
        triangles: '#ffc857',
        geometries: '#b28cff',
        textures: '#ff8f6b',
        gameState: '#8fc3ff',
        playerFallback: '#8fc3ff'
    },
    sunset: {
        fps: '#7ad7ff',
        frameTime: '#ffd07a',
        maxFrameTime: '#ff7aa2',
        drawCalls: '#96e072',
        triangles: '#ffb06a',
        geometries: '#d8a8ff',
        textures: '#ff8f8f',
        gameState: '#98b8ff',
        playerFallback: '#98b8ff'
    }
};

var activeDebugStatsTheme: any = Object.assign({}, DEBUG_STATS_THEMES.neon);

function setDebugStatsTheme(theme: any) {
    if (typeof theme === 'string' && DEBUG_STATS_THEMES[theme]) {
        activeDebugStatsTheme = Object.assign({}, DEBUG_STATS_THEMES[theme]);
        return true;
    }

    if (theme && typeof theme === 'object') {
        activeDebugStatsTheme = Object.assign({}, activeDebugStatsTheme, theme);
        return true;
    }

    return false;
}

function getDebugStatsThemeNames() {
    return Object.keys(DEBUG_STATS_THEMES);
}

function getDebugPlayerColor(player: any) {
    if (!player) return activeDebugStatsTheme.playerFallback;

    if (typeof player.color === 'number') {
        let hex = player.color.toString(16);
        while (hex.length < 6) hex = '0' + hex;
        return '#' + hex;
    }

    if (typeof player.color === 'string') {
        const trimmed = player.color.trim();
        if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed) ||
            /^[a-zA-Z]+$/.test(trimmed)) {
            return trimmed;
        }
    }

    return activeDebugStatsTheme.playerFallback;
}

function formatDebugStats(sample: any, debugInfo: any) {
    let lines = [];

    lines.push(`FPS: ${sample.fps}`);
    lines.push(`FT: ${sample.frameMs.toFixed(1)}ms /
                    ${sample.maxFrameMs.toFixed(1)}ms`);

    if (debugInfo?.renderer?.info) {
        let renderInfo = debugInfo.renderer.info.render;
        let memInfo = debugInfo.renderer.info.memory;
        lines.push(`DC: ${renderInfo.calls}         //draw calls
                    TRI: ${renderInfo.triangles}`); //triangles
        lines.push(`GEO: ${memInfo.geometries}      //geometries
                    TEX: ${memInfo.textures}`);     //textures
    }

    if (debugInfo?.gameManager) {
        let gm = debugInfo.gameManager;
        let currentPlayer = gm?.getCurrentPlayer?.();
        let playerName = currentPlayer?.name ?? 'N/A';
        lines.push('GAMESTATE: ' + gm.gameState);
        lines.push('PLAYER: ' + playerName);
    }

    return lines.join('\n');
}

function formatDebugStatsColored(sample: any, debugInfo: any) {
    var lines = [];
    var theme = activeDebugStatsTheme;

    lines.push(`FPS: ${debugValueSpan(sample.fps, theme.fps)}`);
    lines.push(`FT: ${debugValueSpan(sample.frameMs.toFixed(1) + 'ms', theme.frameTime)} / ${debugValueSpan(sample.maxFrameMs.toFixed(1) + 'ms', theme.maxFrameTime)}`);

    if (debugInfo?.renderer?.info) {
        const renderInfo = debugInfo.renderer.info.render;
        const memInfo = debugInfo.renderer.info.memory;

        lines.push(`DC: ${debugValueSpan(renderInfo.calls, theme.drawCalls)} TRI: ${debugValueSpan(renderInfo.triangles, theme.triangles)}`);
        lines.push(`GEO: ${debugValueSpan(memInfo.geometries, theme.geometries)} TEX: ${debugValueSpan(memInfo.textures, theme.textures)}`);
    }

    if (debugInfo?.gameManager) {
        const gm = debugInfo.gameManager;
        const currentPlayer = gm?.getCurrentPlayer?.();
        const playerName = currentPlayer?.name ?? 'N/A';
        const playerColor = getDebugPlayerColor(currentPlayer);

        lines.push(`GAMESTATE: ${debugValueSpan(gm.gameState, theme.gameState)}`);
        lines.push(`PLAYER: ${debugValueSpan(playerName, playerColor)}`);
    }

    return lines.join('\n');
}
