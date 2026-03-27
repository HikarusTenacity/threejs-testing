// Debug HUD - displays game and camera information
function updateDebugHUD(infoDiv, cameraControls) {
    // Get board coordinates
    var gridPos = getGridCoordinates(cameraControls.mouseWorldPos.x, cameraControls.mouseWorldPos.z);
    
    // Get space info
    var spaceDisplay = 'Off board';
    if (gridPos.spaceId !== null) {
        var spaceInfo = getSpaceById(gridPos.spaceId);
        spaceDisplay = 'Space ' + gridPos.spaceId;
        if (spaceInfo && spaceInfo.name) {
            spaceDisplay += ' (' + spaceInfo.name + ')';
        }
    }

    // Update position info display
    infoDiv.innerHTML = 'Camera: Third Person (drag to orbit, wheel to zoom)<br>' +
        'Mouse World: ' +
        'X: ' + gridPos.x + ' ' +
        'Z: ' + gridPos.z + '<br>' +
        spaceDisplay;
}
