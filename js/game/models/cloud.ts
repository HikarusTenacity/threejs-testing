/**
 * Creates a cloud composed of multiple spheres
 * @param x
 * @param y
 * @param z
 * @param scale
 */
function createCloud(x: number, y: number, z: number, scale: number): THREE.Group {
    const cloud = new THREE.Group();
    const cloudMaterial = new THREE.MeshPhongMaterial({
        color: CLOUD_COLOR,
        flatShading: CLOUD_USES_FLATSHADING,
        transparent: CLOUD_IS_TRANSPARENT,
        opacity: CLOUD_OPACITY,
    });
    cloud.userData.themePart = 'cloud';

    for (let i = 0; i < CLOUD_SPHERE_COUNT; i++) {
        const randomOffset = Math.random() * CLOUD_SPHERE_RADIUS_RANGE;
        const randomRadius: number = (CLOUD_SPHERE_RADIUS_BASE + randomOffset) * scale;
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(
                randomRadius,
                CLOUD_GEOMETRY_DETAIL.widthSegments,
                CLOUD_GEOMETRY_DETAIL.heightSegments
            ),
            cloudMaterial);

        sphere.scale.y = CLOUD_SPHERE_Y_FLATTEN;
        sphere.position.set(
            (Math.random() - 0.5) * CLOUD_SPREAD_XZ * scale,
            (Math.random() - 0.5) * CLOUD_SPREAD_Y * scale,
            (Math.random() - 0.5) * CLOUD_SPREAD_XZ * scale
        );
        cloud.add(sphere);
    }

    cloud.position.set(x, y, z);

    cloud.userData.velocity = {
        x: (Math.random() - 0.5) * CLOUD_BASE_SPEED,
        z: (Math.random() - 0.5) * CLOUD_BASE_SPEED
    };
    cloud.userData.movementBounds = CLOUD_BOUNDS;
    
    return cloud;
}

/**
 * Creates a random cloud within range
 */
function generateCloud(): THREE.Group {
    const halfWidth = (CLOUD_BOUNDS.xMax - CLOUD_BOUNDS.xMin) / 2;
    const randomScale = Math.random() * CLOUD_SCALE_RANGE + CLOUD_SCALE_MIN;

    return createCloud(
        Math.random() * (halfWidth * 2) - halfWidth,
        Math.random() * CLOUD_HEIGHT_RANGE + CLOUD_HEIGHT_MIN,
        Math.random() * (halfWidth * 2) - halfWidth,
        randomScale
    );
}

/**
 * Updates cloud pos based on velo/pos bounds
 * @param cloud
 */
function updateCloudPosition(cloud: THREE.Group) {
    if (cloud.userData.velocity) {
        const speedMult = typeof cloudSpeedMultiplier === 'number' ? cloudSpeedMultiplier : 1;
        cloud.position.x += cloud.userData.velocity.x * speedMult;
        cloud.position.z += cloud.userData.velocity.z * speedMult;

        const bounds = cloud.userData.movementBounds;

        cloud.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, cloud.position.x));
        cloud.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, cloud.position.z));
    }
}
