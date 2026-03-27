// Environment setup - ground, floor, lighting, trees, and mountains
function setupEnvironment(scene) {
    var groundColor = 0x4CAF50;
    var sunlightColor = 0xfff8dc;
    var skyLightColor = 0x87ceeb;

    // Add large green ground plane (Mario 64 style)
    var groundGeometry = new THREE.PlaneGeometry(500, 500);
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
    createTreeRing(scene);

    // Add distant mountains
    createMountains(scene);

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
