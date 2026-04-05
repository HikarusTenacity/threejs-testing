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

function placePieceOnGround(piece, x, z, groundY) {
    piece.position.x = x;
    piece.position.z = z;

    piece.updateMatrixWorld(true);
    var box = new THREE.Box3().setFromObject(piece);
    var deltaY = groundY - box.min.y;
    piece.position.y += deltaY;
}

function createGamePieces() {
    var pieces = [];
    var sharedSize = 1.4;
    var groundY = -1.0;
    var pieceConfigs = [
        { color: "red", x: -4, z: -2 },
        { color: "green", x: -1.2, z: -2.2 },
        { color: "blue", x: 2.6, z: -1.4 },
        { color: "yellow", x: 4.5, z: -2.5 }
    ];

    for (var i = 0; i < pieceConfigs.length; i++) {
        var config = pieceConfigs[i];
        var piece = createGuy(config.color);

        normalizePieceSize(piece, sharedSize);
        placePieceOnGround(piece, config.x, config.z, groundY);
        pieces.push(piece);
    }

    return pieces;
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
