// Cloud model with movement
function createCloud(x, y, z, scale) {
    var cloud = new THREE.Group();
    var cloudColor = 0xffffff;
    var cloudMaterial = new THREE.MeshPhongMaterial({
        color: cloudColor, 
        flatShading: true,
        transparent: true,
        opacity: 0.3
    });

    // Main cloud body - multiple spheres for puffy cloud shape
    var sphere1 = new THREE.Mesh(new THREE.SphereGeometry(10 * scale, 8, 8), cloudMaterial);
    sphere1.scale.y = 0.8;
    sphere1.position.set(0, 0, 0);
    cloud.add(sphere1);

    var sphere2 = new THREE.Mesh(new THREE.SphereGeometry(28 * scale, 8, 8), cloudMaterial);
    sphere2.scale.y = 0.8;
    sphere2.position.set(35 * scale, 0, 0);
    cloud.add(sphere2);

    var sphere3 = new THREE.Mesh(new THREE.SphereGeometry(9 * scale, 8, 8), cloudMaterial);
    sphere3.scale.y = 0.8;
    sphere3.position.set(-30 * scale, 0.5, 0);
    cloud.add(sphere3);

    var sphere4 = new THREE.Mesh(new THREE.SphereGeometry(7 * scale, 8, 8), cloudMaterial);
    sphere4.scale.y = 0.8;
    sphere4.position.set(15 * scale, 1.5, 1);
    cloud.add(sphere4);
    
    // Additional spheres for depth and puffiness
    var sphere5 = new THREE.Mesh(new THREE.SphereGeometry(12 * scale, 8, 8), cloudMaterial);
    sphere5.scale.y = 0.7;
    sphere5.position.set(20 * scale, -1, -8 * scale);
    cloud.add(sphere5);
    
    var sphere6 = new THREE.Mesh(new THREE.SphereGeometry(15 * scale, 8, 8), cloudMaterial);
    sphere6.scale.y = 0.75;
    sphere6.position.set(10 * scale, 2, 10 * scale);
    cloud.add(sphere6);
    
    var sphere7 = new THREE.Mesh(new THREE.SphereGeometry(11 * scale, 8, 8), cloudMaterial);
    sphere7.scale.y = 0.75;
    sphere7.position.set(0, -2, 6 * scale);
    cloud.add(sphere7);
    
    var sphere8 = new THREE.Mesh(new THREE.SphereGeometry(8 * scale, 8, 8), cloudMaterial);
    sphere8.scale.y = 0.7;
    sphere8.position.set(-15 * scale, 1, -6 * scale);
    cloud.add(sphere8);

    cloud.position.set(x, y, z);
    
    // Add movement properties
    cloud.userData.velocity = {
        x: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
    };
    cloud.userData.movementBounds = {
        xMin: -300,
        xMax: 300,
        zMin: -300,
        zMax: 300
    };
    
    return cloud;
}

function generateCloud() {
    var cloud = createCloud(
        Math.random() * 500 - 250, // x between -250 and 250
        Math.random() * 20 + 40, // y between 40 and 60 (higher)
        Math.random() * 500 - 250, // z between -250 and 250
        Math.random() * 0.8 + 0.6 // scale variation
    );
    return cloud;
}

function updateCloudPosition(cloud) {
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
