const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

type retroEffectsSettings = {
    contrast: number;
    saturation: number;
    brightness: number;
    overlayOpacity: number;
};

let retroMode: boolean = false;
let retroOverlay: HTMLDivElement | null = null;
let pixelScale: number = retroMode ? 2 : 1;
const retroEffects: retroEffectsSettings = {
    contrast: 1.12,
    saturation: 0.86,
    brightness: 1.14,
    overlayOpacity: 0.44
};

const renderer = new THREE.WebGLRenderer({ 
    antialias: false, 
    powerPreference: 'high-performance' 
});

function syncViewportSize() {
    const viewportWidth = Math.max(1, window.innerWidth);
    const viewportHeight = Math.max(1, window.innerHeight);

    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        viewportWidth / pixelScale, 
        viewportHeight / pixelScale, 
        false
    );
}

syncViewportSize();
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

function syncRetroUiMode() {
    (window as any).__RETRO_MODE__ = !!retroMode;
    document.body.classList.toggle('retro-ui', !!retroMode);
    renderer.domElement.classList.toggle('retro-canvas', !!retroMode);
}

syncRetroUiMode();

function setRetroModeEnabled(enabled: boolean) {
    retroMode = !!enabled;
    pixelScale = retroMode ? 2 : 1;

    syncRetroUiMode();

    if (retroMode) {
        createRetroOverlay();
    } else {
        if (retroOverlay && retroOverlay.parentNode) {
            retroOverlay.parentNode.removeChild(retroOverlay);
        }
        retroOverlay = null;
        renderer.domElement.style.filter = '';
    }

    syncViewportSize();
}

function createRetroOverlay() {
    if (!retroMode) {
        return;
    }

    retroOverlay = document.createElement('div');
    retroOverlay.className = 'retro-screen-overlay';
    document.body.appendChild(retroOverlay);
}

function updateRetroScreenEffects() {
    if (!retroMode) return;

    renderer.domElement.style.transform = 'translate(0px, 0px)';
    renderer.domElement.style.filter =
        'contrast(' + retroEffects.contrast.toFixed(2) + ') ' +
        'saturate(' + retroEffects.saturation.toFixed(2) + ') ' +
        'brightness(' + retroEffects.brightness.toFixed(2) + ')';

    if (retroOverlay) {
        retroOverlay.style.opacity = retroEffects.overlayOpacity.toFixed(3);
    }
}

createRetroOverlay();

const infoDiv = document.getElementById('info');
const fpsCounter = createFpsCounter();

// create the pieces
const worldPieces = createGamePieces();
for (let pieceIndex = 0; pieceIndex < worldPieces.length; pieceIndex++) {
    scene.add(worldPieces[pieceIndex]);
}

// Initialize board spaces
initializeBoardSpaces();

// Pregame character select lineup
positionPiecesForCharacterSelect(worldPieces);

// Setup environment and get directional light
const directionalLight = setupEnvironment(scene);

// Setup sky elements
setupSky(scene, directionalLight);

// Setup playable space visualization
createPlayableSpacesVisualization(scene);

// Setup board grid visualization
createBoardGridVisualization(scene);

// Setup camera controls
const cameraControls = setupCameraControls(camera, scene);

// Initialize game manager for local 4-player co-op
const gameManager = createGameManager(scene, camera, worldPieces, renderer.domElement);

// Initialize game UI
const gameUI = createGameUI(infoDiv);

// Initialize settings systems
const settingsManager = createSettingsManager();
const settingsMenu = createSettingsMenu(settingsManager);
const creditsScreen = createCreditsScreen();

function setSceneShadowsEnabled(enabled: boolean) {
    renderer.shadowMap.enabled = !!enabled;
    directionalLight.castShadow = !!enabled;
}

function applyMasterVolume(volume: number) {
    const vol = clampValue(volume, 0, 1);

    const mediaNodes = document.querySelectorAll('audio, video') as NodeListOf<HTMLMediaElement>;
    for (let i = 0; i < mediaNodes.length; i++) mediaNodes[i].volume = vol;

    (window as any).__GAME_MASTER_VOLUME__ = vol;
}

function applyGraphicsQuality(quality) {
    let shadowsEnabled = quality !== 'low';
    let effectsEnabled = quality === 'high';

    setSceneShadowsEnabled(shadowsEnabled);

    if (typeof setCloudEffectsEnabled === 'function') {
        setCloudEffectsEnabled(effectsEnabled);
    }

    if (typeof setEnvironmentQuality === 'function') setEnvironmentQuality(quality);

    if (typeof setSkyQuality === 'function') {
        setSkyQuality(quality);
    }
}

function applySettings(settings) {
    applyMasterVolume(settings.volume);
    setRetroModeEnabled(settings.retroMode);
    applyGraphicsQuality(settings.graphicsQuality);
    gameManager.setGameSpeed(settings.gameSpeed);
}

settingsManager.subscribe(applySettings);
applySettings(settingsManager.getAll());

window.addEventListener('resize', function() {
    applyGraphicsQuality(settingsManager.getSetting('graphicsQuality'));
});

settingsMenu.onVolumeChange(function(value) {
    settingsManager.setVolume(value);
});

settingsMenu.onGraphicsChange(function(quality: string) {
    settingsManager.setGraphicsQuality(quality);
});

settingsMenu.onGameSpeedChange(function(speed: number) {
    settingsManager.setGameSpeed(speed);
});

settingsMenu.onRetroModeToggle(function(enabled: boolean) {
    settingsManager.setRetroMode(enabled);
});

settingsMenu.onReset(function() {
    settingsManager.resetToDefaults();
});

settingsMenu.onClose(function() {
    settingsMenu.hide();
});

// Initialize title screen gate
const titleScreen = createTitleScreen();
let hasGameStarted = false;

if (gameManager.inputHandler?.actionButton) {
    gameManager.inputHandler.actionButton.style.display = 'none';
}

titleScreen.onStart(function() {
    hasGameStarted = true;
    titleScreen.hide();

    if (gameManager.inputHandler?.actionButton) {
        gameManager.inputHandler.actionButton.style.display = 'block';
    }
});

titleScreen.onButton('settings', function() {
    settingsMenu.show();
});

titleScreen.onButton('credits', function() {
    creditsScreen.show();
});

// Render loop
var render = function () {
    requestAnimationFrame(render);

    if (!hasGameStarted) {
        camera.position.set(0, 0.7, 5.2);
        camera.lookAt(0, 0.8, 0);
        applyIdleAnimations(worldPieces, Date.now());
        updateEnvironmentAnimations(Date.now());
        updateRetroScreenEffects();
        renderer.render(scene, camera);
        fpsCounter.update({ renderer: renderer, gameManager: gameManager });
        return;
    }

    // Update game manager
    gameManager.update();

    // Update clouds
    updateClouds();

    // Only update camera controls if no animation is playing
    if (gameManager.isPregame()) {
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0.8, 0);
    } else if (!gameManager.diceAnimator.isAnimating) {
        cameraControls.updateCamera();
    }

    if ((window as any).playerAnimator && (window as any).playerAnimator.isAnimating) {
        var stillWalking = (window as any).playerAnimator.update();
        if (!stillWalking) {
            (window as any).playerAnimator = null;
        }
    }

    // Update piece positions based on player locations (skip during animation)
    if (!gameManager.diceAnimator.isAnimating && !gameManager.isPregame()) {
        updateAllPiecePositions();
    }

    applyIdleAnimations(worldPieces, Date.now());
    updateEnvironmentAnimations(Date.now());

    // Update game UI
    gameUI.update(gameManager);

    updateRetroScreenEffects();
    renderer.render(scene, camera);
    fpsCounter.update({ 
        renderer: renderer, 
        gameManager: gameManager 
    });
};

// === ANIMATION EDITOR API ===
// Expose game state for testing/debugging
(window as any).GAME_STATE = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    pieces: worldPieces,
    gameManager: gameManager,
    get playerAnimator() {
        return (window as any).playerAnimator || null;
    },
    diceAnimator: gameManager.diceAnimator,
    get isAnimating() {
        return gameManager.diceAnimator.isAnimating;
    }
};

(window as any).testAnimations = {
    playPlayerWalk: function(playerIndex: number, targetSpace: number) {
        const piece = worldPieces[playerIndex || 0];
        if (!piece) {
            console.error('Player ' + playerIndex + ' not found');
            return;
        }
        let animator = createPlayerAnimator(piece, targetSpace);
        animator.init();
        (window as any).playerAnimator = animator;
    },

    rollDice: function(speedMultiplier: number) {
        if (!gameManager || !gameManager.diceAnimator) {
            console.error('Dice animator not available');
            return;
        }
        gameManager.diceAnimator.setupCutscene();
        gameManager.diceAnimator.setSpeedMultiplier(speedMultiplier || 1.0);
        gameManager.diceAnimator.startDiceRoll();
    },

    setIdleSpeedMultiplier: function(mult: number) {
        worldPieces.forEach((piece: any) => {
            piece.userData.idleSpeedMultiplier = mult;
        });
    },

    setBodySwayAmount: function(amount: number) {
        worldPieces.forEach((piece: any) => {
            piece.userData.bodySwayAmount = amount;
        });
    },

    resetIdlePhases: function() {
        worldPieces.forEach((piece: any) => {
            piece.userData.idlePhase = Math.random() * Math.PI * 2;
        });
    }
};

render();
