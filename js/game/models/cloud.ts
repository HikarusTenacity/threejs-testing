// Cloud model with movement
function createCloud(x: number, y: number, z: number, scale: number) {
    var cloud = new THREE.Group();
    var cloudColor = 0xffffff;
    var cloudMaterial = new THREE.MeshPhongMaterial({
        color: cloudColor, 
        flatShading: true,
        transparent: true,
        opacity: 0.7
    });

    // Main cloud body - multiple spheres for puffy cloud shape
    for (var i = 0; i < 8; i++) {
        var sphere = new THREE.Mesh(new THREE.SphereGeometry((10 + Math.random() * 10) * scale, 8, 4), cloudMaterial);
        sphere.scale.y = 0.8;
        sphere.position.set((Math.random() - 0.5) * 25 * scale, (Math.random() - 0.5) * 10 * scale, (Math.random() - 0.5) * 25 * scale);
        cloud.add(sphere);
    }

    cloud.position.set(x, y, z);
    
    // Add movement properties
    cloud.userData.velocity = {
        x: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
    };
    cloud.userData.movementBounds = {
        xMin: -125,
        xMax: 125,
        zMin: -125,
        zMax: 125
    };
    
    return cloud;
}

function generateCloud() {
    var cloud = createCloud(
        Math.random() * 250 - 125, // x between -125 and 125
        Math.random() * 30 + 30, // y between 30 and 60
        Math.random() * 250 - 125, // z between -125 and 125
        Math.random() * 0.1 + 0.5 // scale variation
    );
    return cloud;
}

function updateCloudPosition(cloud: any) {
    if (cloud.userData.velocity) {
        cloud.position.x += cloud.userData.velocity.x;
        cloud.position.z += cloud.userData.velocity.z;
        
        var bounds = cloud.userData.movementBounds;
        
        // Wrap around when clouds go out of bounds
        if (cloud.position.x < bounds.xMin) {
            cloud.position.x = bounds.xMax;
        } else if (cloud.position.x > bounds.xMax) {
            cloud.position.x = bounds.xMin;
        }

        if (cloud.position.z < bounds.zMin) {
            cloud.position.z = bounds.zMax;
        } else if (cloud.position.z > bounds.zMax) {
            cloud.position.z = bounds.zMin;
        }
    }
}
