// monopoly board
var BOARD_SPACES = [];
var SPACE_BOUNDS = {};
var SPACE_TYPES = {
    GO: 'GO',
    TAX: 'TAX',
    REROLL: 'REROLL',
    NRA_COMMITTEE: 'NRA_COMMITTEE',
    MENTAL_HEALTH_COMMITTEE: 'MENTAL_HEALTH_COMMITTEE',
    AEA_COMMITTEE: 'AEA_COMMITTEE',
    SIERRA_CLUB_COMMITTEE: 'SIERRA_CLUB_COMMITTEE',
    GENERAL_COMMITTEE: 'GENERAL_COMMITTEE',
    SIERRA_VS_AEA: 'SIERRA_VS_AEA',
    MH_VS_NRA: 'MH_VS_NRA',
    CHANCE: 'CHANCE',
    COMMUNITY_CHEST: 'COMMUNITY_CHEST',
    JAIL: 'JAIL',
    POLITICO: 'POLITICO',
    GO_TO_JAIL: 'GO_TO_JAIL',
};

var SPACE_DEFINITIONS = [
    { id: 0, type: SPACE_TYPES.GO, name: 'Appropriations Committee' }, //bottom right
    { id: 1, type: SPACE_TYPES.TAX, name: 'Tax Bracket' },
    { id: 2, type: SPACE_TYPES.REROLL, name: 'Reroll Time' },
    { id: 3, type: SPACE_TYPES.NRA_COMMITTEE, name: 'House Judiciary Committee on Crime/Federal Government Surveillance' },
    { id: 4, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 5, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'House Committee on Judiciary' },
    { id: 6, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 7, type: SPACE_TYPES.NRA_COMMITTEE, name: 'Senate Judiciary Committee on Federal Rights' },
    { id: 8, type: SPACE_TYPES.NRA_COMMITTEE, name: 'Senate Judiciary Committee on Crime and Counterterrorism' },
    { id: 9, type: SPACE_TYPES.NRA_COMMITTEE, name: 'House Judiciary Committee on Constitution and Civil Crime' },
    { id: 10, type: SPACE_TYPES.JAIL, name: 'Conference Committee' }, //bottom left
    { id: 11, type: SPACE_TYPES.SIERRA_VS_AEA, name: 'House Committee on Energy and Commerce' },
    { id: 12, type: SPACE_TYPES.REROLL, name: 'Reroll Time' },
    { id: 13, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'Senate Committee on Health, Education, Labor, and Pensions' },
    { id: 14, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 15, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'House Committee on Armed Services' },
    { id: 16, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 17, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'House\'s Congressional Mental Health Caucus' },
    { id: 18, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'House Ways and Means Committee on Health' },
    { id: 19, type: SPACE_TYPES.MENTAL_HEALTH_COMMITTEE, name: 'Senate Mental Health Caucus' },
    { id: 20, type: SPACE_TYPES.POLITICO, name: 'POLITICO!' }, //top left
    { id: 21, type: SPACE_TYPES.TAX, name: 'Tax Bracket' },
    { id: 22, type: SPACE_TYPES.REROLL, name: 'Reroll Time' },
    { id: 23, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'House Committee on Natural Resources: Water, Wildlife, and Fisheries' },
    { id: 24, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 25, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'Senate Committee on Agriculture, Nutrition, and Forestry' },
    { id: 26, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 27, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'Senate Committee on Environment and Public Works: Waste Management, Environmental Justice, and Regulatory Oversight' },
    { id: 28, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'House Committee on Transportation and Infrastructure: Water Resources and Environment' },
    { id: 29, type: SPACE_TYPES.SIERRA_CLUB_COMMITTEE, name: 'Senate Committee on Environment and Public Works: Water, Wildlife and Fisheries' },
    { id: 30, type: SPACE_TYPES.GO_TO_JAIL, name: 'Filibuster (Go to Conference Committee)' }, //top right
    { id: 31, type: SPACE_TYPES.MH_VS_NRA, name: 'House Committee on Natural Resources: Energy and Mineral Resources' },
    { id: 32, type: SPACE_TYPES.TAX, name: 'Tax Bracket' },
    { id: 33, type: SPACE_TYPES.AEA_COMMITTEE, name: 'House Committee on Ways and Means: Trade' },
    { id: 34, type: SPACE_TYPES.CHANCE, name: 'Chance Space' },
    { id: 35, type: SPACE_TYPES.GENERAL_COMMITTEE, name: 'House Committee on Education and Workforce' },
    { id: 36, type: SPACE_TYPES.COMMUNITY_CHEST, name: 'Lobbyist/Fund Space' },
    { id: 37, type: SPACE_TYPES.AEA_COMMITTEE, name: 'House Committee on Energy and Commerce, Subcommittee on Commerce, Manufacturing, and Trade' },
    { id: 38, type: SPACE_TYPES.AEA_COMMITTEE, name: 'Senate Committee on Commerce, Science, and Transportation: Surface Transportation, Freight, Pipelines, and Safety' },
    { id: 39, type: SPACE_TYPES.AEA_COMMITTEE, name: 'Senate Committee on Commerce, Science, and Transportation: Coast Guard, Maritime, and Fisheries' }
];

var SPACE_DEFINITION_BY_ID = {};
for (var definitionIndex = 0; definitionIndex < SPACE_DEFINITIONS.length; definitionIndex++) {
    SPACE_DEFINITION_BY_ID[SPACE_DEFINITIONS[definitionIndex].id] = SPACE_DEFINITIONS[definitionIndex];
}

// dimensions
var CORNER_MULT = 1.6;
var PROPERTY_WIDTH = 1;
var SCALE = 20 / (2 * CORNER_MULT + 9 * PROPERTY_WIDTH);
var CORNER = CORNER_MULT * SCALE;
var PROPERTY = PROPERTY_WIDTH * SCALE;

// Define space bounds in world coordinates
function defineSpaceLayout() {
    // Create a space with given bounds
    function addSpace(id, xMin, xMax, zMin, zMax) {
        SPACE_BOUNDS[id] = { 
            xMin: xMin, 
            xMax: xMax, 
            zMin: zMin, 
            zMax: zMax };
    }
    
    // Start at top-right corner (space 0), then go counterclockwise
    var zTop = 10 - CORNER;
    var xRight = 10 - CORNER;
    var xLeft = -10 + CORNER;
    var zBottom = -10 + CORNER;

    //topright 0
    addSpace(0, xRight, 10, zTop, 10);  

    //top 1-9
    var x = xRight;
    for (var i = 1; i <= 9; i++) {
        addSpace(i, x - PROPERTY, x, zTop, 10);
        x -= PROPERTY;
    }

    //topleft 10
    addSpace(10, -10, -10 + CORNER, zTop, 10);

    //left 11-19
    var z = 10 - CORNER;
    for (var i = 11; i <= 19; i++) {
        addSpace(i, -10, xLeft, z - PROPERTY, z);
        z -= PROPERTY;
    }

    //bottomleft 20
    addSpace(20, -10, xLeft, -10, zBottom);

    //bottom 21-29
    x = -10 + CORNER;
    for (var i = 21; i <= 29; i++) {
        addSpace(i, x, x + PROPERTY, -10, zBottom);
        x += PROPERTY;
    }

    //bottomright 30
    addSpace(30, xRight, 10, -10, zBottom);

    //right 31-39
    z = -10 + CORNER;
    for (var i = 31; i <= 39; i++) {
        addSpace(i, xRight, 10, z, z + PROPERTY);
        z += PROPERTY;
    }
}

// Initialize all 40 spaces
function initializeBoardSpaces() {
    defineSpaceLayout();
    BOARD_SPACES = [];
    
    for (var id = 0; id < 40; id++) {
        var bounds = SPACE_BOUNDS[id];
        if (!bounds) continue;

        var definition = SPACE_DEFINITION_BY_ID[id] || { id: id, type: SPACE_TYPES.SPECIAL, name: null };
        
        var centerX = (bounds.xMin + bounds.xMax) / 2;
        var centerZ = (bounds.zMin + bounds.zMax) / 2;
        var width = bounds.xMax - bounds.xMin;
        var depth = bounds.zMax - bounds.zMin;
        
        BOARD_SPACES.push({
            id: id,
            name: definition.name,
            type: definition.type,
            bounds: bounds,
            center: {x: centerX, z: centerZ},
            dimensions: {width: width, depth: depth}
        });
    }
}

// Get space by ID (0-39)
function getSpaceById(spaceId) {
    if (spaceId >= 0 && spaceId < BOARD_SPACES.length) {
        return BOARD_SPACES[spaceId];
    }
    return null;
}

// Get space ID from world coordinates
function getSpaceIdFromCoordinates(worldX, worldZ) {
    for (var id = 0; id < 40; id++) {
        var bounds = SPACE_BOUNDS[id];
        if (worldX >= bounds.xMin && worldX < bounds.xMax &&
            worldZ >= bounds.zMin && worldZ < bounds.zMax) {
            return id;
        }
    }
    return null;
}

// Get space bounds by ID
function getSpaceBounds(spaceId) {
    return spaceId >= 0 && spaceId < 40 ? SPACE_BOUNDS[spaceId] : null;
}

// Get/set space names
function getSpaceName(spaceId) {
    var space = getSpaceById(spaceId);
    return space ? space.name : null;
}

function getSpaceType(spaceId) {
    var space = getSpaceById(spaceId);
    return space ? space.type : null;
}

function setSpaceName(spaceId, name) {
    var space = getSpaceById(spaceId);
    if (space) space.name = name;
}

function getSpacesByType(type) {
    var matching = [];
    for (var i = 0; i < BOARD_SPACES.length; i++) {
        if (BOARD_SPACES[i].type === type) {
            matching.push(BOARD_SPACES[i]);
        }
    }
    return matching;
}

// Check if coordinates are on the board
function isOnMonopolyBoard(worldX, worldZ) {
    return getSpaceIdFromCoordinates(worldX, worldZ) !== null;
}