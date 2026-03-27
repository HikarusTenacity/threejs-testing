// Tree model
function createTree(x, z, scale) {
    var tree = new THREE.Group();
    
    // Tree trunk - brown cylinder
    var trunkGeometry = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 3 * scale, 6);
    var trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4d2600, flatShading: true });
    var trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5 * scale - 1;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Tree foliage - green cone/sphere combo
    var foliageGeometry = new THREE.ConeGeometry(1.5 * scale, 3 * scale, 6);
    var foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x1a5f1a, flatShading: true });
    var foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 3.5 * scale - 1;
    foliage.castShadow = true;
    tree.add(foliage);
    
    // Top part of foliage
    var foliage2 = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage2.position.y = 5 * scale - 1;
    foliage2.scale.set(0.7, 0.7, 0.7);
    foliage2.castShadow = true;
    tree.add(foliage2);
    
    tree.position.set(x, 0, z);
    return tree;
}

function createTreeRing(scene) {
    // Create trees in a ring around the board
    // Board is 20x20, so place trees starting at radius ~18 (leaving camera room)
    var minRadius = 18;
    var maxRadius = 35;
    var numTrees = 80;
    
    for (var i = 0; i < numTrees; i++) {
        var angle = (i / numTrees) * Math.PI * 2;
        var radius = minRadius + Math.random() * (maxRadius - minRadius);
        
        var x = Math.cos(angle) * radius;
        var z = Math.sin(angle) * radius;
        
        var scale = 0.8 + Math.random() * 0.6;
        var tree = createTree(x, z, scale);
        scene.add(tree);
    }
}
