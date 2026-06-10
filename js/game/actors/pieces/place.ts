function placePieceOnGround(piece: THREE.Mesh, x: number, z: number, groundY: number) {
    piece.position.x = x;
    piece.position.z = z;

    piece.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(piece);
    const deltaY = groundY - box.min.y;
    piece.position.y += deltaY;
}

function positionPiecesForCharacterSelect(pieces: THREE.Mesh[]) {
    const spacing = 2.2;
    const startX = -((pieces.length - 1) * spacing) / 2;
    const centerZ = 1.2;

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        piece.position.x = startX + i * spacing;
        piece.position.z = centerZ;
        piece.rotation.y = Math.PI;
    }
}