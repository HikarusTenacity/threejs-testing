/// <reference path="../../types/globals.d.ts" />

var environmentVisuals = {
    trees: [],
    mountains: []
};

function setupEnvironment(scene: THREE.Scene) {
    const groundColor = 0x4CAF50;
    const sunlightColor = 0xfff8dc;
    const skyLightColor = 0x87ceeb;

    const groundGeometry = new THREE.PlaneGeometry(225, 225);
    const groundMaterial = new THREE.MeshPhongMaterial({color: groundColor, flatShading: true});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.01;
    ground.receiveShadow = true;
    scene.add(ground);

    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('assets/board.png');

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshPhongMaterial({map: floorTexture});
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    environmentVisuals.trees = createTreeRing(scene) || [];
    for (const tree of environmentVisuals.trees) {
        tree.userData.baseRotationX = tree.rotation.x;
        tree.userData.baseRotationZ = tree.rotation.z;
        tree.userData.swayPhase = Math.random() * Math.PI * 2;
        tree.userData.swayAmplitude = 0.012 + Math.random() * 0.012;
        tree.userData.swaySpeed = 0.75 + Math.random() * 0.45;
    }

    environmentVisuals.mountains = createMountains(scene) || [];

    const directionalLight = new THREE.DirectionalLight(sunlightColor, 1.2);
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

    const ambientLight = new THREE.AmbientLight(skyLightColor, 0.6);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(skyLightColor, groundColor, 0.5);
    scene.add(hemisphereLight);

    return directionalLight;
}

function setEnvironmentQuality(quality: string) {
    const showTrees = quality === 'high';
    const showMountains = quality !== 'low';

    for (const tree of environmentVisuals.trees) tree.visible = showTrees;
    for (const mountain of environmentVisuals.mountains) mountain.visible = showMountains;
}

function updateEnvironmentAnimations(nowMs: number) {
    const animTime = nowMs * 0.001;
    const trees = environmentVisuals.trees;

    if (!trees.length || !trees[0].visible) return;

    for (const tree of trees) {
        const phase = tree.userData.swayPhase || 0;
        const amp = tree.userData.swayAmplitude || 0.015;
        const speed = tree.userData.swaySpeed || 0.9;
        const baseX = tree.userData.baseRotationX || 0;
        const baseZ = tree.userData.baseRotationZ || 0;

        tree.rotation.x = baseX + Math.sin(animTime * speed + phase) * amp;
        tree.rotation.z = baseZ + Math.cos(animTime * (speed * 0.85) + phase) * amp * 0.75;
    }
}
