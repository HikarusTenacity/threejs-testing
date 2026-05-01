// Get space by ID (0-39)
function getSpaceById(spaceId: number) {
    if (spaceId >= 0 && spaceId < BOARD_SPACES.length) {
        return BOARD_SPACES[spaceId];
    }
    return null;
}

// Get space ID from world coordinates
function getSpaceIdFromCoordinates(worldX: number, worldZ: number) {
    for (let id = 0; id < 40; id++) {
        let bounds = SPACE_BOUNDS[id];
        if (worldX >= bounds.xMin && worldX < bounds.xMax &&
            worldZ >= bounds.zMin && worldZ < bounds.zMax) {
            return id;
        }
    }
    return null;
}

// Get space bounds by ID
function getSpaceBounds(spaceId: number) {
    return spaceId >= 0 && spaceId < 40 ? SPACE_BOUNDS[spaceId] : null;
}

// Get/set space names
function getSpaceName(spaceId: number) {
    let space = getSpaceById(spaceId);
    return space ? space.name : null;
}

function getSpaceType(spaceId: number) {
    let space = getSpaceById(spaceId);
    return space ? space.type : null;
}

function setSpaceName(spaceId: number, name: string) {
    let space = getSpaceById(spaceId);
    if (space) space.name = name;
}

function getSpacesByType(type: string) {
    let matching = [];
    for (let i = 0; i < BOARD_SPACES.length; i++) {
        if (BOARD_SPACES[i].type === type) {
            matching.push(BOARD_SPACES[i]);
        }
    }
    return matching;
}

// Check if coordinates are on the board
function isOnMonopolyBoard(worldX: number, worldZ: number) {
    return getSpaceIdFromCoordinates(worldX, worldZ) !== null;
}