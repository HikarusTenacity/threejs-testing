function setPlayerCurrency(playerId: number, amount: number) {
    var player = getPlayerById(playerId);
    if (!player) {
        return;
    }

    player.currency = clampValue(amount, 0, MAX_PLAYER_CURRENCY);
}

function addPlayerCurrency(playerId: number, amountDelta: number) {
    var player = getPlayerById(playerId);
    if (!player) return;

    setPlayerCurrency(playerId, player.currency + amountDelta);
}