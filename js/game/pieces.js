// Piece factory helpers. Individual piece constructors are loaded from:
// js/game/pieces/gun.js
// js/game/pieces/bandage.js
// js/game/pieces/tree.js
// js/game/pieces/briefcase.js

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

    var gun = createSixShooter();
    normalizePieceToSharedSize(gun, sharedHitboxSize);
    gun.rotation.y = 0.35;
    placePieceOnBoard(gun, -4, -2, boardY, clearance);
    pieces.push(gun);

    var healthPack = createHealthPack();
    normalizePieceToSharedSize(healthPack, sharedHitboxSize);
    placePieceOnBoard(healthPack, -1.2, -2.2, boardY, clearance);
    pieces.push(healthPack);

    var tree = createTree();
    normalizePieceToSharedSize(tree, sharedHitboxSize);
    placePieceOnBoard(tree, 2.6, -1.4, boardY, 0.0);
    pieces.push(tree);

    var briefcase = createBriefcase();
    normalizePieceToSharedSize(briefcase, sharedHitboxSize);
    briefcase.rotation.y = -0.45;
    placePieceOnBoard(briefcase, 4.5, -2.5, boardY, clearance);
    pieces.push(briefcase);

    return pieces;
}
