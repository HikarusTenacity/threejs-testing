// Game state and player management
PLAYERS = [];
let PLAYER_PIECES = {};  // Maps player ID to piece object
const MAX_PLAYER_CURRENCY = 99999999;
const MAX_PLAYER_BUFF_SLOTS = 99;

// Player colors
const PLAYER_COLORS = [0xFF0000, 0x008000, 0x0000FF, 0xFFFF00];  // Red, Green, Blue, Yellow

function initializePlayers() {
    PLAYERS = [];
    PLAYER_PIECES = {};

    for (let i = 0; i < 4; i++) {
        let player = {
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
