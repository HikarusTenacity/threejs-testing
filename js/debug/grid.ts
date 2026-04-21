function getGridCoordinates(worldX: number, worldZ: number) {
    const spaceId = getSpaceIdFromCoordinates(worldX, worldZ);
    
    return {
        x: worldX.toFixed(2),
        z: worldZ.toFixed(2),
        spaceId: spaceId
    };
}
