function createPlayableSpacesVisualization(scene: any) {
    const spacesGroup = new THREE.Group();
    
    const boardY = -0.98;
    
    const spaceMaterial = new THREE.MeshBasicMaterial({
        color: 0x4CAF50,  // Green
        opacity: 0.4,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // create plane for space based on bounds
    for (let spaceId = 0; spaceId < 40; spaceId++) {
        const bounds = getSpaceBounds(spaceId);
        if (!bounds) continue;
        
        const centerX = (bounds.xMin + bounds.xMax) / 2;
        const centerZ = (bounds.zMin + bounds.zMax) / 2;
        const width = bounds.xMax - bounds.xMin;
        const depth = bounds.zMax - bounds.zMin;
        
        // create plane geometry for space
        const geometry = new THREE.PlaneGeometry(width, depth);
        const plane = new THREE.Mesh(geometry, spaceMaterial);
        plane.position.set(centerX, boardY, centerZ);
        plane.rotation.x = -Math.PI / 2; 
        plane.userData.spaceId = spaceId;
        spacesGroup.add(plane);
    }
    
    scene.add(spacesGroup);
    return spacesGroup;
}

// create board lines
function createBoardGridVisualization(scene: any) {
    const gridGroup = new THREE.Group();
    const boardY = -0.97;
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
    });
    
    // create grid coordinates
    function generateCoordinates(start: number, step1: number, step2: number) {
        const coords = [start];
        for (let i = 0; i < 11; i++) {
            start += (i === 0 || i === 10) ? step1 : step2;
            coords.push(start);
        }
        return coords;
    }
    
    const xCoords = generateCoordinates(-10, CORNER, PROPERTY);
    const zCoords = generateCoordinates(10, -CORNER, -PROPERTY);
    
    // vertical
    for (let i = 0; i < xCoords.length; i++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(xCoords[i], boardY, -10),
            new THREE.Vector3(xCoords[i], boardY, 10)
        ]);
        gridGroup.add(new THREE.Line(geometry, lineMaterial));
    }
    
    // horizontal
    for (let i = 0; i < zCoords.length; i++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-10, boardY, zCoords[i]),
            new THREE.Vector3(10, boardY, zCoords[i])
        ]);
        gridGroup.add(new THREE.Line(geometry, lineMaterial));
    }
    
    scene.add(gridGroup);
    return gridGroup;
}
