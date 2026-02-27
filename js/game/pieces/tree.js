function createTree() {
    var tree = new THREE.Group();
    var trunkColor = 0x7a4e2d;
    var leavesLowColor = 0x2f9e44;
    var leavesHighColor = 0x37b24d;

    var trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 1.4, 6),
        new THREE.MeshPhongMaterial({ color: trunkColor, flatShading: true })
    );
    trunk.position.y = 0.7;
    trunk.castShadow = true;
    tree.add(trunk);

    var leavesLow = new THREE.Mesh(
        new THREE.ConeGeometry(0.9, 1.0, 8),
        new THREE.MeshPhongMaterial({ color: leavesLowColor, flatShading: true })
    );
    leavesLow.position.y = 1.45;
    leavesLow.castShadow = true;
    tree.add(leavesLow);

    var leavesHigh = new THREE.Mesh(
        new THREE.ConeGeometry(0.65, 0.8, 8),
        new THREE.MeshPhongMaterial({ color: leavesHighColor, flatShading: true })
    );
    leavesHigh.position.y = 2.05;
    leavesHigh.castShadow = true;
    tree.add(leavesHigh);

    return tree;
}
