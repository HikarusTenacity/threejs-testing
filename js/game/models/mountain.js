// Mountain model
function createMountain(x, z, width, height, depth) {
    var mountain = new THREE.Group();
    
    // Create a pyramid-like mountain
    var geometry = new THREE.ConeGeometry(width, height, 4);
    var material = new THREE.MeshPhongMaterial({ 
        color: 0x808080, 
        flatShading: true,
        transparent: true,
        opacity: 0.75
    });
    var cone = new THREE.Mesh(geometry, material);
    cone.position.y = height / 2 - 1;
    cone.rotation.y = Math.PI / 4;
    cone.castShadow = true;
    mountain.add(cone);
    
    // Snow cap
    var snowGeometry = new THREE.ConeGeometry(width * 0.3, height * 0.3, 4);
    var snowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff, 
        flatShading: true,
        transparent: true,
        opacity: 0.8
    });
    var snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
    snowCap.position.y = height * 0.86 - 1;
    snowCap.rotation.y = Math.PI / 4;
    snowCap.castShadow = true;
    mountain.add(snowCap);
    
    mountain.position.set(x, 0, z);
    return mountain;
}

function createMountains(scene) {
    // Create mountain range in the far distance
    var mountainDistance = 80;
    
    // North mountains
    for (var i = 0; i < 5; i++) {
        var x = -60 + i * 30;
        var z = -mountainDistance;
        var width = 15 + Math.random() * 10;
        var height = 25 + Math.random() * 15;
        var mountain = createMountain(x, z, width, height, width);
        scene.add(mountain);
    }
    
    // South mountains
    for (var i = 0; i < 5; i++) {
        var x = -60 + i * 30;
        var z = mountainDistance;
        var width = 15 + Math.random() * 10;
        var height = 25 + Math.random() * 15;
        var mountain = createMountain(x, z, width, height, width);
        scene.add(mountain);
    }
    
    // East mountains
    for (var i = 0; i < 3; i++) {
        var x = mountainDistance;
        var z = -40 + i * 40;
        var width = 15 + Math.random() * 10;
        var height = 25 + Math.random() * 15;
        var mountain = createMountain(x, z, width, height, width);
        scene.add(mountain);
    }
    
    // West mountains
    for (var i = 0; i < 3; i++) {
        var x = -mountainDistance;
        var z = -40 + i * 40;
        var width = 15 + Math.random() * 10;
        var height = 25 + Math.random() * 15;
        var mountain = createMountain(x, z, width, height, width);
        scene.add(mountain);
    }
}
