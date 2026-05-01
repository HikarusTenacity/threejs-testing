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
        piece.userData.baseY = piece.position.y;
        piece.userData.idlePhase = Math.random() * Math.PI * 2;
        
        // Animation parameters (can be tweaked by editor)
        piece.userData.idleSpeedMultiplier = 1.0;
        piece.userData.bodySwayAmount = 0.15;
        piece.userData.headBobAmount = 0.08;

        for (var childIndex = 0; childIndex < piece.children.length; childIndex++) {
            var child = piece.children[childIndex];
            child.userData.idleBasePosition = child.position.clone();
            child.userData.idleBaseRotation = child.rotation.clone();
        }

        pieces.push(piece);
    }

    return pieces;
}