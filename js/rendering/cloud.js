function createCloud(x, y, z, scale) {
    var cloud = new THREE.Group();
    var cloudColor = 0xffffff;
    var cloudMaterial = new THREE.MeshPhongMaterial({
        color: cloudColor, 
        flatShading: true,
        transparent: true,
        opacity: 0.3
    });

    var sphere1 = new THREE.Mesh(new THREE.SphereGeometry(10 * scale, 6, 6), cloudMaterial);
    sphere1.scale.y = 0.7;
    sphere1.position.set(0, 0, 0);
    cloud.add(sphere1);

    var sphere2 = new THREE.Mesh(new THREE.SphereGeometry(28 * scale, 6, 6), cloudMaterial);
    sphere2.scale.y = 0.7;
    sphere2.position.set(35 * scale, 0, 0);
    cloud.add(sphere2);

    var sphere3 = new THREE.Mesh(new THREE.SphereGeometry(9 * scale, 6, 6), cloudMaterial);
    sphere3.scale.y = 0.7;
    sphere3.position.set(-30 * scale, 0.5, 0);
    cloud.add(sphere3);

    var sphere4 = new THREE.Mesh(new THREE.SphereGeometry(7 * scale, 6, 6), cloudMaterial);
    sphere4.scale.y = 0.7;
    sphere4.position.set(15 * scale, 1.5, 1);
    cloud.add(sphere4);

    cloud.position.set(x, y, z);
    return cloud;
}

function generateCloud() {
    var cloud = createCloud(
        Math.random() * 500 - 250, // x between -250 and 250
        Math.random() * 20 + 40, // y between 40 and 60 (higher)
        Math.random() * 500 - 250, // z between -250 and 250
        Math.random() * 0.8 + 0.6 // scale variation
    );
    return cloud;
}