function createSixShooter() {
    var gun = new THREE.Group();
    var gripColor = 0x6b3f2a;
    var gunBodyColor = 0x555555;
    var barrelColor = 0x777777;
    var cylinderColor = 0x999999;

    var grip = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.7, 0.2),
        new THREE.MeshPhongMaterial({ color: gripColor, flatShading: true })
    );
    grip.position.set(-0.1, -0.25, 0);
    grip.castShadow = true;
    gun.add(grip);

    var body = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.25, 0.25),
        new THREE.MeshPhongMaterial({ color: gunBodyColor, flatShading: true })
    );
    body.castShadow = true;
    gun.add(body);

    var barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.65, 8),
        new THREE.MeshPhongMaterial({ color: barrelColor, flatShading: true })
    );
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.7, 0, 0);
    barrel.castShadow = true;
    gun.add(barrel);

    var cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.22, 6),
        new THREE.MeshPhongMaterial({ color: cylinderColor, flatShading: true })
    );
    cylinder.rotation.z = Math.PI / 2;
    cylinder.position.set(0.15, 0, 0);
    cylinder.castShadow = true;
    gun.add(cylinder);

    gun.scale.set(1.2, 1.2, 1.2);
    return gun;
}
