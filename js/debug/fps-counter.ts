function createFpsCounter() {
    let el = document.createElement('div');
    el.textContent = 'FPS: --';
    el.style.cssText = `
        position: fixed;
        right: 8px;
        bottom: 50%;
        z-index: 999;
        pointer-events: none;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.2;
        white-space: pre;
        text-align: right;
        color: #e8e8e8;
        text-shadow: 1px 1px 0 #000;
    `;
    document.body.appendChild(el);

    const sampler = createFpsSampler(1000);

    return {
        update: function(debugInfo: any) {
            el.style.color = '#e8e8e8';

            const now = performance.now();
            const sample = sampler.tick(now);
            if (!sample) return;

            if (typeof formatDebugStatsColored === 'function') {
                el.innerHTML = formatDebugStatsColored(sample, debugInfo);
            } else {
                el.textContent = 'FPS: ' + sample.fps + '\nFT: ' + sample.frameMs.toFixed(1) + 'ms';
            }
        }
    };
}
