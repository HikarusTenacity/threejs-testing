// Board grid coordinate system
// Converts world coordinates to 13x13 grid coordinates (1 large, 9 small, 1 large per side)
function getGridCoordinates(worldX, worldZ) {
    // Board spans from -10 to 10 on both axes (20x20 units)
    // Map to 13x13 grid
    var cellSize = 20 / 13;
    
    var gridX = Math.floor((worldX + 10) / cellSize);
    var gridZ = Math.floor((worldZ + 10) / cellSize);
    
    // Clamp to valid grid range
    gridX = Math.max(0, Math.min(12, gridX));
    gridZ = Math.max(0, Math.min(12, gridZ));
    
    return {
        col: gridX,
        row: gridZ,
    };
}
