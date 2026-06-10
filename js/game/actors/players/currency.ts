function setPlayerCurrency(playerId: number, amount: number) {
    const player = getPlayerById(playerId);
    if (!player) return;

    player.currency = clampValue(amount, 0, MAX_PLAYER_CURRENCY);
}

function addPlayerCurrency(playerId: number, amountDelta: number) {
    const player = getPlayerById(playerId);
    if (!player) return;

    setPlayerCurrency(playerId, player.currency + amountDelta);
}