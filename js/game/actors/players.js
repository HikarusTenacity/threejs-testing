// Game state and player management
var PLAYERS = [];
var PLAYER_PIECES = {};  // Maps player ID to piece object
var MAX_PLAYER_CURRENCY = 99999999;
var MAX_PLAYER_BUFF_SLOTS = 99;

// Player colors
var PLAYER_COLORS = [0xFF0000, 0x008000, 0x0000FF, 0xFFFF00];  // Red, Green, Blue, Yellow

function clampValue(value, minValue, maxValue) {
    return Math.max(minValue, Math.min(maxValue, value));
}

// Initialize players with pieces
function initializePlayers() {
    PLAYERS = [];
    PLAYER_PIECES = {};

    for (var i = 0; i < 4; i++) {
        var player = {
            id: i,
            name: "Player " + (i + 1),
            color: PLAYER_COLORS[i],
            pieceType: "Unselected",
            currentSpace: 0,
            currency: 0,
            buffs: [],
            piece: null  // Will be set after pieces are created
        };
        PLAYERS.push(player);
    }
}

// Set a player's piece
function setPlayerPiece(playerId, piece) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        PLAYERS[playerId].piece = piece;
        PLAYER_PIECES[playerId] = piece;
    }
}

// Move player to a space
function movePlayerToSpace(playerId, spaceId) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        PLAYERS[playerId].currentSpace = spaceId;
    }
}

function setPlayerCurrency(playerId, amount) {
    var player = getPlayerById(playerId);
    if (!player) {
        return;
    }

    player.currency = clampValue(amount, 0, MAX_PLAYER_CURRENCY);
}

function addPlayerCurrency(playerId, amountDelta) {
    var player = getPlayerById(playerId);
    if (!player) {
        return;
    }

    setPlayerCurrency(playerId, player.currency + amountDelta);
}

function addPlayerBuff(playerId, buffName) {
    var player = getPlayerById(playerId);
    if (!player || !buffName) {
        return false;
    }

    if (player.buffs.length >= MAX_PLAYER_BUFF_SLOTS) {
        return false;
    }

    player.buffs.push(buffName);
    return true;
}

function removePlayerBuff(playerId, buffName) {
    var player = getPlayerById(playerId);
    if (!player || !buffName) {
        return false;
    }

    var buffIndex = player.buffs.indexOf(buffName);
    if (buffIndex < 0) {
        return false;
    }

    player.buffs.splice(buffIndex, 1);
    return true;
}

function clearPlayerBuffs(playerId) {
    var player = getPlayerById(playerId);
    if (!player) {
        return;
    }

    player.buffs = [];
}

// Get pieces at a space
function getPiecesAtSpace(spaceId) {
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

// Get player by ID
function getPlayerById(playerId) {
    if (playerId >= 0 && playerId < PLAYERS.length) {
        return PLAYERS[playerId];
    }
    return null;
}

// Initialize on load
initializePlayers();
