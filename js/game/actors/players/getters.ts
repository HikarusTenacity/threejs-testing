function getPiecesAtSpace(spaceId: number) {
    var pieces = [];
    for (var i = 0; i < PLAYERS.length; i++) {
        if (PLAYERS[i].currentSpace === spaceId && PLAYERS[i].piece) {
            pieces.push({
                playerId: PLAYERS[i].id,
                piece: PLAYERS[i].piece,
                index: pieces.length
            });
        }
    }
    return pieces;
}

function getPlayerById(playerId: number) {
    //validate and return
    if (playerId >= 0 && playerId < PLAYERS.length) {
        return PLAYERS[playerId];
    }
    return null;
}