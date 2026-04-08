// Sky elements - sun, clouds, fog, background
var cloudsToUpdate = [];
var cloudEffectsEnabled = true;
var skyQuality = 'high';
var skyScene = null;
var skyColor = 0x87ceeb;
var fogColor = 0x5a7a9e;
var sunMesh = null;
var haloMesh = null;

function setupSky(scene, directionalLight) {
    var sunColor = 0xffff00;
    skyScene = scene;

    var sunGeometry = new THREE.SphereGeometry(3, 16, 16);
    var sunMaterial = new THREE.MeshBasicMaterial({color: sunColor, flatShading: true});
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.copy(directionalLight.position);
    scene.add(sunMesh);

    // Glow halo around sun
    var haloGeometry = new THREE.SphereGeometry(8, 32, 32);
    var haloMaterial = new THREE.MeshBasicMaterial({
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
    for (var i = 0; i < 80; i++) {
        var cloud = generateCloud();
        scene.add(cloud);
        cloudsToUpdate.push(cloud);
    }

    //give sky gradient with atmospheric fog
    applySkyQuality();
}

function updateClouds() {
    if (!cloudEffectsEnabled || skyQuality !== 'high') return;
    for (var c of cloudsToUpdate) updateCloudPosition(c);
}

function setCloudEffectsEnabled(enabled) {
    cloudEffectsEnabled = !!enabled;

    applySkyQuality();
}

function setSkyQuality(quality) {
    var validQualities = ['low', 'medium', 'high'];

    if (validQualities.indexOf(quality) === -1) {
        quality = 'high';
    }

    skyQuality = quality;
    applySkyQuality();
}

function applySkyQuality() {
    var showBackground = skyQuality !== 'low';
    var showClouds = skyQuality === 'high';
    var cloudVisible = showClouds && cloudEffectsEnabled;

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

    for (var i = 0; i < cloudsToUpdate.length; i++) {
        cloudsToUpdate[i].visible = cloudVisible;
    }
}
