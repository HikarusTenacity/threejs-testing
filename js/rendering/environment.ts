const environmentVisuals = {trees: [], mountains: []};
let treeSwayMultiplier = 1;
let environmentTheme = {
    groundColor: 0x4CAF50,
    sunlightColor: 0xfff8dc,
    skyLightColor: 0x87ceeb,
    treeTrunkColor: 0x4d2600,
    treeFoliageColor: 0x1a5f1a,
    mountainColor: 0x808080,
    snowColor: 0xffffff,
    cloudColor: 0xffffff,
    boardSpaceColor: 0x4CAF50,
    boardGridColor: 0xffffff
};
let environmentMaterials = {
    ground: null as THREE.MeshPhongMaterial | null,
    floor: null as THREE.MeshPhongMaterial | null,
    directionalLight: null as THREE.DirectionalLight | null,
    ambientLight: null as THREE.AmbientLight | null,
    hemisphereLight: null as THREE.HemisphereLight | null
};

function setupEnvironment(scene: THREE.Scene) {
    if (typeof getGameTheme === 'function') {
        environmentTheme = getGameTheme().visuals.environment;
    }

    const groundColor = environmentTheme.groundColor;
    const sunlightColor = environmentTheme.sunlightColor;
    const skyLightColor = environmentTheme.skyLightColor;

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

    environmentMaterials.ground = groundMaterial;
    environmentMaterials.floor = floorMaterial;
    environmentMaterials.directionalLight = directionalLight;
    environmentMaterials.ambientLight = ambientLight;
    environmentMaterials.hemisphereLight = hemisphereLight;

    return directionalLight;
}

function setEnvironmentTheme(theme: {
    groundColor: number;
    sunlightColor: number;
    skyLightColor: number;
    treeTrunkColor: number;
    treeFoliageColor: number;
    mountainColor: number;
    snowColor: number;
    cloudColor: number;
    boardSpaceColor: number;
    boardGridColor: number;
}) {
    environmentTheme = theme;

    if (environmentMaterials.ground) {
        environmentMaterials.ground.color.setHex(theme.groundColor);
    }

    if (environmentMaterials.floor) {
        environmentMaterials.floor.color.setHex(theme.groundColor);
    }

    if (environmentMaterials.directionalLight) {
        environmentMaterials.directionalLight.color.setHex(theme.sunlightColor);
    }

    if (environmentMaterials.ambientLight) {
        environmentMaterials.ambientLight.color.setHex(theme.skyLightColor);
    }

    if (environmentMaterials.hemisphereLight) {
        environmentMaterials.hemisphereLight.color.setHex(theme.skyLightColor);
        environmentMaterials.hemisphereLight.groundColor.setHex(theme.groundColor);
    }

    for (const tree of environmentVisuals.trees) {
        tree.traverse(function(node) {
            if (!node.isMesh || !node.material || !node.material.color) return;
            if (node.userData.themePart === 'treeTrunk') {
                node.material.color.setHex(theme.treeTrunkColor);
            } else if (node.userData.themePart === 'treeFoliage') {
                node.material.color.setHex(theme.treeFoliageColor);
            }
        });
    }

    for (const mountain of environmentVisuals.mountains) {
        mountain.traverse(function(node) {
            if (!node.isMesh || !node.material || !node.material.color) return;
            if (node.userData.themePart === 'mountain') {
                node.material.color.setHex(theme.mountainColor);
            } else if (node.userData.themePart === 'snow') {
                node.material.color.setHex(theme.snowColor);
            }
        });
    }

    if (typeof cloudsToUpdate !== 'undefined') {
        for (const cloud of cloudsToUpdate) {
            cloud.traverse(function(node) {
                if (!node.isMesh || !node.material || !node.material.color) return;
                if (node.userData.themePart === 'cloud') {
                    node.material.color.setHex(theme.cloudColor);
                }
            });
        }
    }
}

function setEnvironmentQuality(quality: string) {
    const showTrees = quality === 'high';
    const showMountains = quality !== 'low';

    for (const tree of environmentVisuals.trees) tree.visible = showTrees;
    for (const mountain of environmentVisuals.mountains) mountain.visible = showMountains;
}

function setTreeSwayMultiplier(multiplier: number) {
    treeSwayMultiplier = Math.max(0, multiplier || 1);
}

function updateEnvironmentAnimations(nowMs: number) {
    const animTime = nowMs * 0.001;
    const trees = environmentVisuals.trees;

    if (!trees.length || !trees[0].visible) return;

    for (const tree of trees) {
        const phase = tree.userData.swayPhase || 0;
        const amp = (tree.userData.swayAmplitude || 0.015) * treeSwayMultiplier;
        const speed = (tree.userData.swaySpeed || 0.9) * treeSwayMultiplier;
        const baseX = tree.userData.baseRotationX || 0;
        const baseZ = tree.userData.baseRotationZ || 0;

        tree.rotation.x = baseX + Math.sin(animTime * speed + phase) * amp;
        tree.rotation.z = baseZ + Math.cos(animTime * (speed * 0.85) + phase) * amp * 0.75;
    }
}
