function createFpsSampler(sampleWindowMs) {
    var windowMs = typeof sampleWindowMs === 'number' ? sampleWindowMs : 1000;
    var lastFrameTime = performance.now();
    var lastSample = lastFrameTime;
    var frameCount = 0;
    var fps = 0;
    var frameMs = 0;
    var maxFrameMs = 0;

    return {
        tick: function(now) {
            frameCount += 1;

            frameMs = now - lastFrameTime;
            lastFrameTime = now;
            if (frameMs > maxFrameMs) maxFrameMs = frameMs;

            var elapsed = now - lastSample;
            if (elapsed < windowMs) return null;

            fps = Math.floor((frameCount * 1000) / elapsed);

            frameCount = 0;
            lastSample = now;

            return {
                fps: fps,
                frameMs: frameMs,
                maxFrameMs: maxFrameMs
            };
        }
    };
}
