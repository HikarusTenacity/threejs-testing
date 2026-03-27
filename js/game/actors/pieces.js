function normalizePieceToSharedSize(piece, targetSize) {
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

    piece.userData.hitboxSize = targetSize;
}

function placePieceOnBoard(piece, x, z, boardY, clearance) {
    piece.position.x = x;
    piece.position.z = z;

    piece.updateMatrixWorld(true);
    var box = new THREE.Box3().setFromObject(piece);
    var deltaY = (boardY + clearance) - box.min.y;
    piece.position.y += deltaY;
}

function createGamePieces() {
    var pieces = [];
    var sharedHitboxSize = 1.4;
    var boardY = -1.0;
    var clearance = 0.02;

    var redGuy = createGuy("red");
    normalizePieceToSharedSize(redGuy, sharedHitboxSize);
    placePieceOnBoard(redGuy, -4, -2, boardY, clearance);
    pieces.push(redGuy);

    var greenGuy = createGuy("green");
    normalizePieceToSharedSize(greenGuy, sharedHitboxSize);
    placePieceOnBoard(greenGuy, -1.2, -2.2, boardY, clearance);
    pieces.push(greenGuy);

    var blueGuy = createGuy("blue");
    normalizePieceToSharedSize(blueGuy, sharedHitboxSize);
    placePieceOnBoard(blueGuy, 2.6, -1.4, boardY, clearance);
    pieces.push(blueGuy);

    var yellowGuy = createGuy("yellow");
    normalizePieceToSharedSize(yellowGuy, sharedHitboxSize);
    placePieceOnBoard(yellowGuy, 4.5, -2.5, boardY, clearance);
    pieces.push(yellowGuy);

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
