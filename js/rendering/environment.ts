// Environment setup - ground, floor, lighting, trees, and mountains
var environmentVisuals = {
    trees: [],
    mountains: []
};

function setupEnvironment(scene) {
    var groundColor = 0x4CAF50;
    var sunlightColor = 0xfff8dc;
    var skyLightColor = 0x87ceeb;

    // Add large green ground plane (Mario 64 style)
    var groundGeometry = new THREE.PlaneGeometry(225, 225);
    var groundMaterial = new THREE.MeshPhongMaterial({color: groundColor, flatShading: true});
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add floor with texture on top of green ground (the board)
    var textureLoader = new THREE.TextureLoader();
    var floorTexture = textureLoader.load('assets/board.png');

    var floorGeometry = new THREE.PlaneGeometry(20, 20);
    var floorMaterial = new THREE.MeshPhongMaterial({map: floorTexture});
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add trees around the board in a clearing
    environmentVisuals.trees = createTreeRing(scene) || [];
    for (var treeIndex = 0; treeIndex < environmentVisuals.trees.length; treeIndex++) {
        var tree = environmentVisuals.trees[treeIndex];
        tree.userData.baseRotationX = tree.rotation.x;
        tree.userData.baseRotationZ = tree.rotation.z;
        tree.userData.swayPhase = Math.random() * Math.PI * 2;
        tree.userData.swayAmplitude = 0.012 + Math.random() * 0.012;
        tree.userData.swaySpeed = 0.75 + Math.random() * 0.45;
    }

    // Add distant mountains
    environmentVisuals.mountains = createMountains(scene) || [];

    // Mario 64 style lighting with sun
    var directionalLight = new THREE.DirectionalLight(sunlightColor, 1.2);
    directionalLight.position.set(30, 40, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight(skyLightColor, 0.6);
    scene.add(ambientLight);

    var hemisphereLight = new THREE.HemisphereLight(skyLightColor, groundColor, 0.5);
    scene.add(hemisphereLight);

    return directionalLight;
}

function setEnvironmentQuality(quality) {
    var showTrees = quality === 'high';
    var showMountains = quality !== 'low';

    for (var i = 0; i < environmentVisuals.trees.length; i++) {
        environmentVisuals.trees[i].visible = showTrees;
    }

    for (var mountainIndex = 0; mountainIndex < environmentVisuals.mountains.length; mountainIndex++) {
        environmentVisuals.mountains[mountainIndex].visible = showMountains;
    }
}

function updateEnvironmentAnimations(nowMs) {
    var t = nowMs * 0.001;

    for (var i = 0; i < environmentVisuals.trees.length; i++) {
        var tree = environmentVisuals.trees[i];
        if (!tree.visible) {
            continue;
        }

        var phase = tree.userData.swayPhase || 0;
        var amp = tree.userData.swayAmplitude || 0.015;
        var speed = tree.userData.swaySpeed || 0.9;
        var baseX = tree.userData.baseRotationX || 0;
        var baseZ = tree.userData.baseRotationZ || 0;

        tree.rotation.x = baseX + Math.sin(t * speed + phase) * amp;
        tree.rotation.z = baseZ + Math.cos(t * (speed * 0.85) + phase) * amp * 0.75;
    }
}
