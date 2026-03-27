// Sky elements - sun, clouds, fog, background
var cloudsToUpdate = [];

function setupSky(scene, directionalLight) {
    var sunColor = 0xffff00;
    var skyColor = 0x87ceeb;

    var sunGeometry = new THREE.SphereGeometry(3, 16, 16);
    var sunMaterial = new THREE.MeshBasicMaterial({color: sunColor, flatShading: true});
    var sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.copy(directionalLight.position);
    scene.add(sun);

    // Glow halo around sun
    var haloGeometry = new THREE.SphereGeometry(8, 32, 32);
    var haloMaterial = new THREE.MeshBasicMaterial({
        color: sunColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    var halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.copy(directionalLight.position);
    scene.add(halo);
    
    //generate clouds
    cloudsToUpdate = [];
    for (var i = 0; i < 80; i++) {
        var cloud = generateCloud();
        scene.add(cloud);
        cloudsToUpdate.push(cloud);
    }

    //give sky gradient with atmospheric fog
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.Fog(skyColor, 30, 100);
}

function updateClouds() {
    for (var i = 0; i < cloudsToUpdate.length; i++) {
        updateCloudPosition(cloudsToUpdate[i]);
    }
}
