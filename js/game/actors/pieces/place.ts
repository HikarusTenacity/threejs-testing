function placePieceOnGround(piece, x, z, groundY) {
    piece.position.x = x;
    piece.position.z = z;

    piece.updateMatrixWorld(true);
    var box = new THREE.Box3().setFromObject(piece);
    var deltaY = groundY - box.min.y;
    piece.position.y += deltaY;
}

function positionPiecesForCharacterSelect(pieces) {
    var spacing = 2.2;
    var startX = -((pieces.length - 1) * spacing) / 2;
    var centerZ = 1.2;

    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        piece.position.x = startX + i * spacing;
        piece.position.z = centerZ;
        piece.rotation.y = Math.PI;
    }
}