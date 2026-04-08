// Board playable spaces visualization - shows all 40 Monopoly spaces in green
function createPlayableSpacesVisualization(scene) {
    var spacesGroup = new THREE.Group();
    
    var boardY = -0.98;  // Just above the board plane
    
    // Material for playable spaces
    var spaceMaterial = new THREE.MeshBasicMaterial({
        color: 0x4CAF50,  // Green
        opacity: 0.4,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // Create planes for each space based on its bounds
    for (var spaceId = 0; spaceId < 40; spaceId++) {
        var bounds = getSpaceBounds(spaceId);
        if (!bounds) continue;
        
        // Calculate dimensions and center
        var centerX = (bounds.xMin + bounds.xMax) / 2;
        var centerZ = (bounds.zMin + bounds.zMax) / 2;
        var width = bounds.xMax - bounds.xMin;
        var depth = bounds.zMax - bounds.zMin;
        
        // Create plane geometry for the space
        var geometry = new THREE.PlaneGeometry(width, depth);
        var plane = new THREE.Mesh(geometry, spaceMaterial);
        plane.position.set(centerX, boardY, centerZ);
        plane.rotation.x = -Math.PI / 2;  // Rotate to lie flat on board
        plane.userData.spaceId = spaceId;  // Store space ID for reference
        spacesGroup.add(plane);
    }
    
    scene.add(spacesGroup);
    return spacesGroup;
}

// Board grid visualization - draws grid lines for monopoly spaces
function createBoardGridVisualization(scene) {
    var gridGroup = new THREE.Group();
    var boardY = -0.97;
    
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
    });
    
    // Generate grid coordinates
    function generateCoordinates(start, step1, step2) {
        var coords = [start];
        for (var i = 0; i < 11; i++) {
            var step = (i === 0 || i === 10) ? step1 : step2;
            start += step;
            coords.push(start);
        }
        return coords;
    }
    
    var xCoords = generateCoordinates(-10, CORNER, PROPERTY);
    var zCoords = generateCoordinates(10, -CORNER, -PROPERTY);
    
    // Draw vertical lines
    for (var i = 0; i < xCoords.length; i++) {
        var geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(xCoords[i], boardY, -10),
            new THREE.Vector3(xCoords[i], boardY, 10)
        ]);
        gridGroup.add(new THREE.Line(geometry, lineMaterial));
    }
    
    // Draw horizontal lines
    for (var i = 0; i < zCoords.length; i++) {
        var geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-10, boardY, zCoords[i]),
            new THREE.Vector3(10, boardY, zCoords[i])
        ]);
        gridGroup.add(new THREE.Line(geometry, lineMaterial));
    }
    
    scene.add(gridGroup);
    return gridGroup;
}
