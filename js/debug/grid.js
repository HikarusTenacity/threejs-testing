// Board grid coordinate system
// Converts world coordinates to space ID on the Monopoly board
function getGridCoordinates(worldX, worldZ) {
    var spaceId = getSpaceIdFromCoordinates(worldX, worldZ);
    
    return {
        x: worldX.toFixed(2),
        z: worldZ.toFixed(2),
        spaceId: spaceId
    };
}
