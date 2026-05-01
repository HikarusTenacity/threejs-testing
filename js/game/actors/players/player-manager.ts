// Game state and player management
var PLAYERS = [];
var PLAYER_PIECES = {};  // Maps player ID to piece object
var MAX_PLAYER_CURRENCY = 99999999;
var MAX_PLAYER_BUFF_SLOTS = 99;

// Player colors
var PLAYER_COLORS = [0xFF0000, 0x008000, 0x0000FF, 0xFFFF00];  // Red, Green, Blue, Yellow

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

initializePlayers();
