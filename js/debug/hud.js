// Debug HUD - displays game and camera information
function updateDebugHUD(infoDiv, cameraControls) {
    // Get board grid coordinates
    var gridPos = getGridCoordinates(cameraControls.mouseWorldPos.x, cameraControls.mouseWorldPos.z);

    // Update position info display
    infoDiv.innerHTML = 'Camera: Third Person (drag to orbit, wheel to zoom)<br>' +
        'Mouse World: ' +
        'X: ' + cameraControls.mouseWorldPos.x.toFixed(2) + ' ' +
        'Z: ' + cameraControls.mouseWorldPos.z.toFixed(2) + '<br>' +
        'Board Grid: Col ' + gridPos.col + ', Row ' + gridPos.row;
}
