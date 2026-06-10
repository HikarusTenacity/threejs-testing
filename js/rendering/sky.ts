let cloudsToUpdate: THREE.Mesh[] = [];
let cloudEffectsEnabled = true;
let skyQuality = 'high';
let skyScene: THREE.Scene = null;
const skyColor = 0x87ceeb;
const fogColor = 0x5a7a9e;
let sunMesh: THREE.Mesh = null;
let haloMesh: THREE.Mesh = null;
let cloudSpeedMultiplier = 1;

type SkyQuality = 'low' | 'medium' | 'high';

function setupSky(scene: THREE.Scene, directionalLight: THREE.DirectionalLight) {
    const sunColor = 0xffff00;
    skyScene = scene;

    const sunGeometry = new THREE.SphereGeometry(3, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({color: sunColor, flatShading: true});
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.copy(directionalLight.position);
    scene.add(sunMesh);

    // Glow halo around sun
    const haloGeometry = new THREE.SphereGeometry(8, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
        color: sunColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.position.copy(directionalLight.position);
    scene.add(haloMesh);
    
    //generate clouds
    cloudsToUpdate = [];
    for (let i = 0; i < 80; i++) {
        const cloud = generateCloud();
        scene.add(cloud);
        cloudsToUpdate.push(cloud);
    }

    applySkyQuality();
}

function updateClouds() {
    if (!cloudEffectsEnabled || skyQuality !== 'high') return;
    for (const c of cloudsToUpdate) updateCloudPosition(c);
}

function setCloudEffectsEnabled(enabled: boolean) {
    cloudEffectsEnabled = enabled;
    applySkyQuality();
}

function setCloudSpeedMultiplier(multiplier: number) {
    cloudSpeedMultiplier = Math.max(0, multiplier || 1);
}

function setSkyQuality(quality: SkyQuality = 'high') {
    skyQuality = quality;
    applySkyQuality();
}

function applySkyQuality() {
    const showBackground = skyQuality !== 'low';
    const showClouds = skyQuality === 'high';
    const cloudsVisible = showClouds && cloudEffectsEnabled;

    if (sunMesh) sunMesh.visible = showBackground;
    if (haloMesh) haloMesh.visible = showBackground;

    if (skyScene) {
        if (showBackground) {
            skyScene.background = new THREE.Color(skyColor);
            skyScene.fog = new THREE.Fog(fogColor, 5, 100);
        } else {
            skyScene.background = null;
            skyScene.fog = null;
        }
    }

    for (const cloud of cloudsToUpdate) {
        cloud.visible = cloudsVisible;
    }
}
