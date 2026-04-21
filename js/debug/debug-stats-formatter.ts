function formatDebugStats(sample, debugInfo) {
    var lines = [];

    lines.push('FPS: ' + sample.fps);
    lines.push('FT: ' + sample.frameMs.toFixed(1) + 'ms / ' + sample.maxFrameMs.toFixed(1) + 'ms');

    // renderer info
    if (debugInfo?.renderer?.info) {
        var renderInfo = debugInfo.renderer.info.render;
        var memInfo = debugInfo.renderer.info.memory;
        lines.push(`DC: ${renderInfo.calls}         //draw calls
                    TRI: ${renderInfo.triangles}`); //triangles drawn
        lines.push(`GEO: ${memInfo.geometries}      //geometries in memory
                    TEX: ${memInfo.textures}`);     //textures in memory
    }

    // gamestate info
    if (debugInfo?.gameManager) {
        var gm = debugInfo.gameManager;
        var currentPlayer = gm.getCurrentPlayer?.() ?? null;
        var playerName = currentPlayer?.name ?? 'N/A';
        lines.push('GAMESTATE: ' + gm.gameState);
        lines.push('PLAYER: ' + playerName);
    }

    return lines.join('\n');
}
