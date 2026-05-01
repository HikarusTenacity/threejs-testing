function normalizePieceSize(piece, targetSize) {
    piece.updateMatrixWorld(true);

    var box = new THREE.Box3().setFromObject(piece);
    var size = box.getSize(new THREE.Vector3());
    var maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
        var uniformScale = targetSize / maxDim;
        piece.scale.multiplyScalar(uniformScale);
    }

    piece.updateMatrixWorld(true);
    box.setFromObject(piece);

    var center = box.getCenter(new THREE.Vector3());
    piece.position.x -= center.x;
    piece.position.z -= center.z;

    piece.updateMatrixWorld(true);
    box.setFromObject(piece);
    piece.position.y -= box.min.y;
}