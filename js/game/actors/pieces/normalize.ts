function normalizePieceSize(piece, targetSize) {
    piece.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(piece);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
        const uniformScale = targetSize / maxDim;
        piece.scale.multiplyScalar(uniformScale);
    }

    piece.updateMatrixWorld(true);
    box.setFromObject(piece);

    const center = box.getCenter(new THREE.Vector3());
    piece.position.x -= center.x;
    piece.position.z -= center.z;

    piece.updateMatrixWorld(true);
    box.setFromObject(piece);
    piece.position.y -= box.min.y;
}