function createFpsCounter() {
    var el = document.createElement('div');
    el.textContent = 'FPS: --';
    el.style.position = 'fixed';
    el.style.right = '8px';
    el.style.bottom = '50%';
    el.style.zIndex = '999';
    el.style.pointerEvents = 'none';
    el.style.background = 'none';
    el.style.border = 'none';
    el.style.padding = '0';
    el.style.margin = '0';
    el.style.fontFamily = 'monospace';
    el.style.fontSize = '12px';
    el.style.lineHeight = '1.2';
    el.style.whiteSpace = 'pre';
    el.style.textAlign = 'right';
    el.style.color = '#e8e8e8';
    el.style.textShadow = '1px 1px 0 #000';
    document.body.appendChild(el);

    var sampler = createFpsSampler(1000);

    function getCurrentPlayerInfo(debugInfo) {
        if (!debugInfo || !debugInfo.gameManager || !debugInfo.gameManager.getCurrentPlayer) {
            return null;
        }

        var currentPlayer = debugInfo.gameManager.getCurrentPlayer();
        if (!currentPlayer) {
            return null;
        }

        var playerColor = null;

        if (typeof currentPlayer.color === 'number') {
            var hex = currentPlayer.color.toString(16);
            while (hex.length < 6) {
                hex = '0' + hex;
            }
            playerColor = '#' + hex;
        } else if (typeof currentPlayer.color === 'string') {
            var trimmedColor = currentPlayer.color.trim();
            if (/^#[0-9a-fA-F]{3,8}$/.test(trimmedColor) || /^[a-zA-Z]+$/.test(trimmedColor)) {
                playerColor = trimmedColor;
            }
        }

        return {
            name: currentPlayer.name || 'N/A',
            color: playerColor
        };
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function valueSpan(value, color) {
        return '<span style="color: ' + color + ';">' + escapeHtml(value) + '</span>';
    }

    function renderColoredStats(sample, debugInfo, playerInfo) {
        var lines = [];

        lines.push('FPS: ' + valueSpan(sample.fps, '#78dce8'));
        lines.push(
            'FT: ' + valueSpan(sample.frameMs.toFixed(1) + 'ms', '#ffd166') +
            ' / ' + valueSpan(sample.maxFrameMs.toFixed(1) + 'ms', '#ef476f')
        );

        if (debugInfo && debugInfo.renderer && debugInfo.renderer.info) {
            var renderInfo = debugInfo.renderer.info.render;
            var memInfo = debugInfo.renderer.info.memory;

            lines.push(
                'DC: ' + valueSpan(renderInfo.calls, '#a6e22e') +
                ' TRI: ' + valueSpan(renderInfo.triangles, '#fd971f')
            );
            lines.push(
                'GEO: ' + valueSpan(memInfo.geometries, '#c792ea') +
                ' TEX: ' + valueSpan(memInfo.textures, '#f07178')
            );
        }

        if (debugInfo && debugInfo.gameManager) {
            var gm = debugInfo.gameManager;
            var currentPlayer = gm.getCurrentPlayer ? gm.getCurrentPlayer() : null;
            var playerName = currentPlayer && currentPlayer.name ? currentPlayer.name : 'N/A';
            var playerColor = playerInfo && playerInfo.color ? playerInfo.color : '#82aaff';

            lines.push('GAMESTATE: ' + valueSpan(gm.gameState, '#82aaff'));
            lines.push('PLAYER: ' + valueSpan(playerName, playerColor));
        }

        return lines.join('\n');
    }

    return {
        update: function(debugInfo) {
            el.style.color = '#e8e8e8';

            var now = performance.now();
            var sample = sampler.tick(now);
            if (!sample) return;

            var playerInfo = getCurrentPlayerInfo(debugInfo);
            el.innerHTML = renderColoredStats(sample, debugInfo, playerInfo);
        }
    };
}
