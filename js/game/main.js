// Main initialization and render loop
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
var pixelScale = 3; 

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

// Create world pieces
var worldPieces = createGamePieces();
for (var pieceIndex = 0; pieceIndex < worldPieces.length; pieceIndex++) {
    scene.add(worldPieces[pieceIndex]);
}

// Setup environment and get directional light
var directionalLight = setupEnvironment(scene);

// Setup sky elements
setupSky(scene, directionalLight);

// Setup camera controls
var cameraControls = setupCameraControls(camera, scene);

// Render loop
var render = function () {
    requestAnimationFrame(render);

    // Update camera
    cameraControls.updateCamera();

    // Update debug HUD display
    updateDebugHUD(infoDiv, cameraControls);

    renderer.render(scene, camera);
};

render();
