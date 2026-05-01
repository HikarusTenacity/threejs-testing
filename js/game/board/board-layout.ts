function defineSpaceLayout() {
    function addSpace(id: number, xMin: number, xMax: number, zMin: number, zMax: number) {
        SPACE_BOUNDS[id] = { 
            xMin: xMin, 
            xMax: xMax, 
            zMin: zMin, 
            zMax: zMax };
    }
    
    // Start at top-right corner (space 0), then go counterclockwise
    let zTop = 10 - CORNER;
    let xRight = 10 - CORNER;
    let xLeft = -10 + CORNER;
    let zBottom = -10 + CORNER;

    //topright 0
    addSpace(0, xRight, 10, zTop, 10);  

    //top 1-9
    let x = xRight;
    for (let i = 1; i <= 9; i++) {
        addSpace(i, x - PROPERTY, x, zTop, 10);
        x -= PROPERTY;
    }

    //topleft 10
    addSpace(10, -10, -10 + CORNER, zTop, 10);

    //left 11-19
    let z = 10 - CORNER;
    for (let i = 11; i <= 19; i++) {
        addSpace(i, -10, xLeft, z - PROPERTY, z);
        z -= PROPERTY;
    }

    //bottomleft 20
    addSpace(20, -10, xLeft, -10, zBottom);

    //bottom 21-29
    x = -10 + CORNER;
    for (let i = 21; i <= 29; i++) {
        addSpace(i, x, x + PROPERTY, -10, zBottom);
        x += PROPERTY;
    }

    //bottomright 30
    addSpace(30, xRight, 10, -10, zBottom);

    //right 31-39
    z = -10 + CORNER;
    for (let i = 31; i <= 39; i++) {
        addSpace(i, xRight, 10, z, z + PROPERTY);
        z += PROPERTY;
    }
}

function initializeBoardSpaces() {
    defineSpaceLayout();
    BOARD_SPACES = [];
    
    for (let id = 0; id < 40; id++) {
        let bounds = SPACE_BOUNDS[id];
        if (!bounds) continue;

        let definition = SPACE_DEFINITION_BY_ID[id] || { id: id, type: SPACE_TYPES.GENERAL_COMMITTEE, name: null };
        
        let centerX = (bounds.xMin + bounds.xMax) / 2;
        let centerZ = (bounds.zMin + bounds.zMax) / 2;
        let width = bounds.xMax - bounds.xMin;
        let depth = bounds.zMax - bounds.zMin;
        
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