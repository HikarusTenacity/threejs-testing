/**
 * Creates a tree model w/ trunk and foliage composed of 2 segments
 * @param x
 * @param z
 * @param scale
 */
function createTree(x: number, z: number, scale: number): THREE.Group {
    const tree = new THREE.Group();

    const trunkGeometry = new THREE.CylinderGeometry(
        TREE_TRUNK_RADIUS_TOP * scale,
        TREE_TRUNK_RADIUS_BOTTOM * scale,
        TREE_TRUNK_HEIGHT * scale,
        TREE_TRUNK_SEGMENTS
    );
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: TREE_TRUNK_COLOR, flatShading: TREE_TRUNK_USES_FLATSHADING });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.userData.themePart = 'treeTrunk';
    trunk.position.y = (TREE_TRUNK_HEIGHT / 2) * scale + TREE_TRUNK_Y_OFFSET;
    trunk.castShadow = TREE_TRUNK_CASTS_SHADOW;
    tree.add(trunk);

    const foliageGeometry = new THREE.ConeGeometry(
        TREE_FOLIAGE_RADIUS * scale,
        TREE_FOLIAGE_HEIGHT * scale,
        TREE_FOLIAGE_SEGMENTS
    );
    const foliageMaterial = new THREE.MeshPhongMaterial({ color: TREE_FOLIAGE_COLOR, flatShading: TREE_FOLIAGE_USES_FLATSHADING });

    const bottomFoliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    bottomFoliage.userData.themePart = 'treeFoliage';
    bottomFoliage.position.y = TREE_FOLIAGE_LOWER_Y * scale + TREE_TRUNK_Y_OFFSET;
    bottomFoliage.castShadow = TREE_FOLIAGE_CASTS_SHADOW;
    tree.add(bottomFoliage);

    const topFoliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    topFoliage.userData.themePart = 'treeFoliage';
    topFoliage.position.y = TREE_FOLIAGE_UPPER_Y * scale + TREE_TRUNK_Y_OFFSET;
    topFoliage.scale.set(TREE_FOLIAGE_TOP_SCALE, TREE_FOLIAGE_TOP_SCALE, TREE_FOLIAGE_TOP_SCALE);
    topFoliage.castShadow = TREE_FOLIAGE_CASTS_SHADOW;
    tree.add(topFoliage);
    
    tree.position.set(x, 0, z);
    return tree;
}

/**
 * Creates a ring of trees around the center of the scene, with random positions and sizes within specified ranges
 * @param scene
 */
function createTreeRing(scene: THREE.Scene): THREE.Group[] {
    let trees: THREE.Group[] = [];
    
    for (let i = 0; i < TREE_RING_COUNT; i++) {
        const angle = (i / TREE_RING_COUNT) * Math.PI * 2;
        const radius = TREE_RING_MIN_RADIUS + Math.random() * (TREE_RING_MAX_RADIUS - TREE_RING_MIN_RADIUS);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        //increase in size based on dist from center4
        const distFromCenter = THREE.MathUtils.inverseLerp(
            TREE_RING_MIN_RADIUS,
            TREE_RING_MAX_RADIUS,
            radius
        );
        const sizeCurve = distFromCenter ** 2;
        const scale = 1 + sizeCurve + Math.random() * TREE_SCALE_RANDOM_RANGE;
        const tree: THREE.Group = createTree(x, z, scale);
        scene.add(tree);
        trees.push(tree);
    }

    return trees;
}
