function createHealthPack() {
    var pack = new THREE.Group();
    var bandageSideColor = 0xe9ecef;
    var bandageCenterColor = 0xf8f9fa;
    var bandageStripeColor = 0xd62828;

    var leftSegment = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.75, 0.85),
        new THREE.MeshPhongMaterial({ color: bandageSideColor, flatShading: true })
    );
    leftSegment.position.x = -0.34;
    leftSegment.castShadow = true;
    pack.add(leftSegment);

    var middleSegment = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.8, 0.88),
        new THREE.MeshPhongMaterial({ color: bandageCenterColor, flatShading: true })
    );
    middleSegment.castShadow = true;
    pack.add(middleSegment);

    var rightSegment = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.75, 0.85),
        new THREE.MeshPhongMaterial({ color: bandageSideColor, flatShading: true })
    );
    rightSegment.position.x = 0.34;
    rightSegment.castShadow = true;
    pack.add(rightSegment);

    var stripeH = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.14, 0.06),
        new THREE.MeshPhongMaterial({ color: bandageStripeColor, flatShading: true })
    );
    stripeH.position.set(0, 0, 0.46);
    stripeH.castShadow = true;
    pack.add(stripeH);

    var stripeV = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.28, 0.06),
        new THREE.MeshPhongMaterial({ color: bandageStripeColor, flatShading: true })
    );
    stripeV.position.set(0, 0, 0.47);
    stripeV.castShadow = true;
    pack.add(stripeV);

    return pack;
}
