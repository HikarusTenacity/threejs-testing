type DebugSample = {
    fps: number;
    frameMs: number;
    maxFrameMs: number;
};

type DebugInfo = {
    renderer?: {
        info?: {
            render: {
                calls: number;
                triangles: number;
            };
            memory: {
                geometries: number;
                textures: number;
            };
        };
    };
    gameManager?: {
        getCurrentPlayer?: () => { name: string; color?: number | string } | null;
        gameState: string;
    };
};

type DebugTheme = {
    fps: string;
    frameTime: string;
    maxFrameTime: string;
    drawCalls: string;
    triangles: string;
    geometries: string;
    textures: string;
    gameState: string;
    playerFallback: string;
};
