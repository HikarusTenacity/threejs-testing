/**
 * Creates a mountain with snow at (x, z) with width/height.
 * @param x
 * @param z
 * @param width
 * @param height
 */
function createMountain(x: number, z: number, width: number, height: number) {
    const mountain = new THREE.Group();
    
    // Create a pyramid-like mountain
    const geometry = new THREE.ConeGeometry(width, height, MOUNTAIN_GEOMETRY_DETAIL);
    const material = new THREE.MeshPhongMaterial({
        color: MOUNTAIN_COLOR,
        flatShading: MOUNTAIN_USES_FLATSHADING,
        transparent: MOUNTAIN_IS_TRANSPARENT,
        opacity: MOUNTAIN_OPACITY
    });

    const cone = new THREE.Mesh(geometry, material);
    cone.userData.themePart = 'mountain';
    cone.position.y = height / 2 - 1;
    cone.rotation.y = Math.PI / 4; //rot 45 deg
    cone.castShadow = MOUNTAIN_CASTS_SHADOW;
    mountain.add(cone);
    
    // Snow cap
    const snowGeometry = new THREE.ConeGeometry(width * SNOW_SCALE, height * SNOW_SCALE, SNOW_GEOMETRY_DETAIL);
    const snowMaterial = new THREE.MeshPhongMaterial({
        color: SNOW_COLOR,
        flatShading: SNOW_USES_FLATSHADING,
        transparent: SNOW_IS_TRANSPARENT,
        opacity: SNOW_OPACITY
    });
    const snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
    snowCap.userData.themePart = 'snow';
    snowCap.position.y = height * SNOW_MIN_HEIGHT - 1;
    snowCap.rotation.y = Math.PI / 4; //rot 45 deg
    snowCap.castShadow = SNOW_CASTS_SHADOW;
    mountain.add(snowCap);
    
    mountain.position.set(x, 0, z);
    return mountain;
}

/**
 * Creates a ring of mountains around the center
 * @param scene
 */
function createMountains(scene: THREE.Scene): THREE.Group[] {
    let mountains: THREE.Group[] = [];

    /**
     * Spawns a mountain at (x, z)
     * @param x
     * @param z
     */
    const spawnMountain = (x: number, z: number): void => {
        const mountain: THREE.Group = createRandomMountain(x, z);
        scene.add(mountain);
        mountains.push(mountain);
    };

    /**
     * Creates a random mountain with a random width/height at (x, z)
     * @param x
     * @param z
     */
    const createRandomMountain = (x: number, z: number): THREE.Group => {
        const width = MOUNTAIN_WIDTH_BASE + (Math.random() * MOUNTAIN_WIDTH_RANGE);
        const height = MOUNTAIN_HEIGHT_BASE + (Math.random() * MOUNTAIN_HEIGHT_RANGE);
        return createMountain(x, z, width, height);
    };

    for (let i = 0; i < 5; i++) {
        spawnMountain((i-1) * MOUNTAIN_HALF_DISTANCE, -MOUNTAIN_DISTANCE);
    }
    for (let i = 0; i < 5; i++) {
        spawnMountain((i-1) * MOUNTAIN_HALF_DISTANCE, MOUNTAIN_DISTANCE);
    }
    for (let i = 0; i < 5; i++) {
        spawnMountain(MOUNTAIN_DISTANCE, (i-1) * MOUNTAIN_HALF_DISTANCE);
    }
    for (let i = 0; i < 5; i++) {
        spawnMountain(-MOUNTAIN_DISTANCE, (i-1) * MOUNTAIN_HALF_DISTANCE);
    }

    return mountains;
}
