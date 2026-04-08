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
    var minRadius = 18;
    var maxRadius = 60;
    var numTrees = 150;
    var trees = [];
    
    for (var i = 0; i < numTrees; i++) {
        var angle = (i / numTrees) * Math.PI * 2;
        var radius = minRadius + Math.random() * (maxRadius - minRadius);
        
        //pos
        var x = Math.cos(angle) * radius;
        var z = Math.sin(angle) * radius;
        
        // increase size based on dist from center
        var distFromCenter = (radius - minRadius) / (maxRadius - minRadius);
        var scale = 1 + (Math.pow(2,distFromCenter * distFromCenter)) + Math.random() * 0.25;
        var tree = createTree(x, z, scale);
        scene.add(tree);
        trees.push(tree);
    }

    return trees;
}
