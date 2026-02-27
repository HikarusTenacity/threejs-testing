function createBriefcase() {
    var briefcase = new THREE.Group();
    var briefcaseBodyColor = 0x1f1f1f;
    var briefcaseStripeColor = 0x444444;
    var briefcaseHandleColor = 0xb08968;

    var body = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.7, 0.35),
        new THREE.MeshPhongMaterial({ color: briefcaseBodyColor, flatShading: true })
    );
    body.castShadow = true;
    briefcase.add(body);

    var stripe = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.12, 0.37),
        new THREE.MeshPhongMaterial({ color: briefcaseStripeColor, flatShading: true })
    );
    stripe.position.y = 0.12;
    stripe.castShadow = true;
    briefcase.add(stripe);

    var handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.05, 6, 10),
        new THREE.MeshPhongMaterial({ color: briefcaseHandleColor, flatShading: true })
    );
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 0.45, 0);
    handle.castShadow = true;
    briefcase.add(handle);

    return briefcase;
}
