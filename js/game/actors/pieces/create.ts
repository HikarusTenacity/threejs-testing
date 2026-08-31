/**
 * Creates game pieces with specified configurations, normalizes their sizes, places them on the ground, and sets up animation parameters.
 * Saves initial positions and rotations for idle animations.
 * @returns An array of created game pieces.
 *
 */

function createGamePieces(): THREE.Mesh[] {
    let pieces: THREE.Mesh[] = [];
    const sharedSize = 1.4;
    const groundY = -1.0;
    const pieceConfigs: { color: string; x: number; z: number }[] = [ //FIXME: Make it editable in config
        { color: "red", x: -4, z: -2 },
        { color: "green", x: -1.2, z: -2.2 },
        { color: "blue", x: 2.6, z: -1.4 },
        { color: "yellow", x: 4.5, z: -2.5 }
    ];

    for (const element of pieceConfigs) {
        const config = element;
        const piece: THREE.Group = createGuy(config.color);

        normalizePieceSize(piece, sharedSize);
        placePieceOnGround(piece, config.x, config.z, groundY);
        piece.userData.baseY = piece.position.y;
        piece.userData.idlePhase = Math.random() * Math.PI * 2; //NOSONAR
        
        // Animation parameters
        piece.userData.idleSpeedMultiplier = 1.0;
        piece.userData.bodySwayAmount = 0.15;
        piece.userData.headBobAmount = 0.08;

        for (const child of piece.children) {
            child.userData.idleBasePosition = child.position.clone();
            child.userData.idleBaseRotation = child.rotation.clone();
        }

        pieces.push(piece);
    }

    return pieces;
}