function formatDebugStats(sample, debugInfo) {
    var lines = [];

    lines.push('FPS: ' + sample.fps);
    lines.push('FT: ' + sample.frameMs.toFixed(1) + 'ms / ' + sample.maxFrameMs.toFixed(1) + 'ms');

    if (debugInfo && debugInfo.renderer && debugInfo.renderer.info) {
        var renderInfo = debugInfo.renderer.info.render;
        var memInfo = debugInfo.renderer.info.memory;
        lines.push('DC: ' + renderInfo.calls + ' TRI: ' + renderInfo.triangles);
        lines.push('GEO: ' + memInfo.geometries + ' TEX: ' + memInfo.textures);
    }

    if (debugInfo && debugInfo.gameManager) {
        var gm = debugInfo.gameManager;
        var currentPlayer = gm.getCurrentPlayer ? 
                                gm.getCurrentPlayer() : 
                                null;
        var playerName = currentPlayer && 
                         currentPlayer.name ? 
                            currentPlayer.name : 
                            'N/A';
        lines.push('GAMESTATE: ' + gm.gameState);
        lines.push('PLAYER: ' + playerName);
    }

    return lines.join('\n');
}
