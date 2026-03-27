// Main initialization and render loop
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
var pixelScale = 1; 

renderer.setSize(window.innerWidth / pixelScale, window.innerHeight / pixelScale);
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.left = '0';
renderer.domElement.style.top = '0';
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var infoDiv = document.getElementById('info');

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

// Render loop
var render = function () {
    requestAnimationFrame(render);

    if (!hasGameStarted) {
        camera.position.set(0, 0.7, 5.2);
        camera.lookAt(0, 0.8, 0);
        renderer.render(scene, camera);
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

    renderer.render(scene, camera);
};

render();
