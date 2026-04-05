// Main initialization and render loop
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var retroMode = true;
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
renderer.domElement.classList.add('retro-canvas');
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

function createRetroOverlay() {
    if (!retroMode) {
        return;
    }

    retroOverlay = document.createElement('div');
    retroOverlay.className = 'retro-screen-overlay';
    document.body.appendChild(retroOverlay);
}

function updateRetroScreenEffects() {
    if (!retroMode) {
        return;
    }

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
    var clamped = Math.max(0, Math.min(1, volume));

    var mediaNodes = document.querySelectorAll('audio, video');
    for (var i = 0; i < mediaNodes.length; i++) {
        mediaNodes[i].volume = clamped;
    }

    // Fallback global volume for future sound effects codepaths.
    window.__GAME_MASTER_VOLUME__ = clamped;
}

function applyGraphicsQuality(quality) {
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    if (quality === 'low') {
        pixelRatio = Math.min(pixelRatio, 0.85);
        renderer.shadowMap.type = THREE.BasicShadowMap;
    } else if (quality === 'medium') {
        pixelRatio = Math.min(pixelRatio, 1.2);
        renderer.shadowMap.type = THREE.PCFShadowMap;
    } else {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    if (retroMode) {
        pixelRatio = Math.min(pixelRatio, 0.85);
    }

    renderer.setPixelRatio(pixelRatio);
    syncViewportSize();
}

function applySettings(settings) {
    applyMasterVolume(settings.volume);
    applyGraphicsQuality(settings.graphicsQuality);
    setSceneShadowsEnabled(settings.shadowsEnabled);
    gameManager.setGameSpeed(settings.gameSpeed);

    if (typeof setCloudEffectsEnabled === 'function') {
        setCloudEffectsEnabled(settings.effectsEnabled);
    }
}

settingsManager.subscribe(applySettings);
applySettings(settingsManager.getAll());

window.addEventListener('resize', function() {
    applyGraphicsQuality(settingsManager.get('graphicsQuality'));
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

settingsMenu.onShadowsToggle(function(enabled) {
    settingsManager.setShadowsEnabled(enabled);
});

settingsMenu.onEffectsToggle(function(enabled) {
    settingsManager.setEffectsEnabled(enabled);
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

    // Update game UI
    gameUI.update(gameManager);

    updateRetroScreenEffects();
    renderer.render(scene, camera);
    fpsCounter.update({ renderer: renderer, gameManager: gameManager });
};

render();
