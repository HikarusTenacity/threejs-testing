// Main initialization and render loop
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var retroMode = false;
var retroOverlay = null;
var renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
var pixelScale = retroMode ? 2 : 1;
var retroEffects = {
    contrast: 1.12,
    saturation: 0.86,
    brightness: 1.14,
    overlayOpacity: 0.44
};

function syncViewportSize() {
    var viewportWidth = Math.max(1, window.innerWidth);
    var viewportHeight = Math.max(1, window.innerHeight);

    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();

    // Keep CSS size controlled by styles while updating render target resolution.
    renderer.setSize(viewportWidth / pixelScale, viewportHeight / pixelScale, false);
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

function setRetroModeEnabled(enabled) {
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

var infoDiv = document.getElementById('info');
var fpsCounter = createFpsCounter();

// create the pieces
var worldPieces = createGamePieces();
for (var pieceIndex = 0; pieceIndex < worldPieces.length; pieceIndex++) {
    scene.add(worldPieces[pieceIndex]);
}

// Initialize board spaces
initializeBoardSpaces();

// Pregame character select lineup
positionPiecesForCharacterSelect(worldPieces);

// Setup environment and get directional light
var directionalLight = setupEnvironment(scene);

// Setup sky elements
setupSky(scene, directionalLight);

// Setup playable space visualization
createPlayableSpacesVisualization(scene);

// Setup board grid visualization
createBoardGridVisualization(scene);

// Setup camera controls
var cameraControls = setupCameraControls(camera, scene);

// Initialize game manager for local 4-player co-op
var gameManager = createGameManager(scene, camera, worldPieces, renderer.domElement);

// Initialize game UI
var gameUI = createGameUI(infoDiv);

// Initialize settings systems
var settingsManager = createSettingsManager();
var settingsMenu = createSettingsMenu(settingsManager);
var creditsScreen = createCreditsScreen();

function setSceneShadowsEnabled(enabled) {
    renderer.shadowMap.enabled = !!enabled;
    directionalLight.castShadow = !!enabled;
}

function applyMasterVolume(volume) {
    // clamp all volumes to a value between 0 and 1
    var clamped = Math.max(0, Math.min(1, volume));

    var mediaNodes = document.querySelectorAll('audio, video') as NodeListOf<HTMLMediaElement>;
    for (var i = 0; i < mediaNodes.length; i++) mediaNodes[i].volume = clamped;

    // Fallback global volume for future sound effects codepaths.
    (window as any).__GAME_MASTER_VOLUME__ = clamped;
}

function applyGraphicsQuality(quality) {
    var shadowsEnabled = quality !== 'low';
    var effectsEnabled = quality === 'high';

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

settingsMenu.onGraphicsChange(function(quality) {
    settingsManager.setGraphicsQuality(quality);
});

settingsMenu.onGameSpeedChange(function(speed) {
    settingsManager.setGameSpeed(speed);
});

settingsMenu.onRetroModeToggle(function(enabled) {
    settingsManager.setRetroMode(enabled);
});

settingsMenu.onReset(function() {
    settingsManager.resetToDefaults();
});

settingsMenu.onClose(function() {
    settingsMenu.hide();
});

// Initialize title screen gate
var titleScreen = createTitleScreen();
var hasGameStarted = false;

if (gameManager.inputHandler && gameManager.inputHandler.actionButton) {
    gameManager.inputHandler.actionButton.style.display = 'none';
}

titleScreen.onStart(function() {
    hasGameStarted = true;
    titleScreen.hide();

    if (gameManager.inputHandler && gameManager.inputHandler.actionButton) {
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
    fpsCounter.update({ renderer: renderer, gameManager: gameManager });
};

// === ANIMATION EDITOR API ===
// Expose game state for testing/debugging
(window as any).GAME_STATE = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    pieces: worldPieces,
    gameManager: gameManager,
    diceAnimator: gameManager.diceAnimator,
    get isAnimating() {
        return gameManager.diceAnimator.isAnimating;
    }
};

(window as any).testAnimations = {
    playPlayerWalk: function(playerIndex: number, targetSpace: number) {
        var piece = worldPieces[playerIndex || 0];
        if (!piece) {
            console.error('Player ' + playerIndex + ' not found');
            return;
        }
        var animator = createPlayerAnimator(piece, targetSpace);
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
