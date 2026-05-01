// Piece positioning and distribution logic

// Distribute pieces evenly within a space
// Returns array of positions for each piece
function distributePiecesInSpace(piecesAtSpace: any[], spaceId: number) {
    var spaceBounds = getSpaceBounds(spaceId);
    var pieceCount = piecesAtSpace.length;

    if (pieceCount === 0) return [];

    var positions = [];
    var width = spaceBounds.xMax - spaceBounds.xMin;
    var depth = spaceBounds.zMax - spaceBounds.zMin;

    var cols, rows;
    cols = (pieceCount % 2 === 0) ? 2 : 1;
    rows = (pieceCount < 4) ? 1 : 2; 

    var cellWidth = width / cols;
    var cellDepth = depth / rows;

    for (var i = 0; i < pieceCount; i++) {
        var col = i % cols;
        var row = Math.floor(i / cols);

        var x = spaceBounds.xMin + (col + 0.5) * cellWidth;
        var z = spaceBounds.zMin + (row + 0.5) * cellDepth;

        positions.push({
            x: x,
            z: z,
            playerIndex: piecesAtSpace[i].playerId
        });
    }

    return positions;
}

// Update a piece's position to match its player's space
function updatePiecePosition(piece, position) {
    if (piece && position) {
        piece.position.x = position.x;
        piece.position.z = position.z;
    }
}

// Update all pieces on board based on player positions
function updateAllPiecePositions() {
    for (var playerId = 0; playerId < PLAYERS.length; playerId++) {
        var player = PLAYERS[playerId];
        var piecesAtSpace = getPiecesAtSpace(player.currentSpace);
        var positions = distributePiecesInSpace(piecesAtSpace, player.currentSpace);

        for (var i = 0; i < positions.length; i++) {
            if (positions[i].playerIndex === playerId && player.piece) {
                updatePiecePosition(player.piece, positions[i]);
            }
        }
    }
}


function setPlayerPiece(playerId, piece) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        PLAYERS[playerId].piece = piece;
        PLAYER_PIECES[playerId] = piece;
    }
}

function movePlayerToSpace(playerId, spaceId) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        PLAYERS[playerId].currentSpace = spaceId;
    }
}