function makeDot(diceGroup, x, y, z, radius) {
    var dotGeometry = new THREE.SphereGeometry(radius, 8, 8);
    var dotMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.set(x, y, z);
    dot.castShadow = true;
    diceGroup.add(dot);
}

function createDice() {
    //make dice as a group of a cube and dots
    var dice = new THREE.Group();
    
    //make cube (doubled from 0.16 to 0.32)
    var geometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    var materials = [
        new THREE.MeshPhongMaterial({ color: 0xffffff }),  // right (1)
        new THREE.MeshPhongMaterial({ color: 0xffffff }),  // left (6)
        new THREE.MeshPhongMaterial({ color: 0xffffff }),  // top (5)
        new THREE.MeshPhongMaterial({ color: 0xffffff }),  // bottom (2)
        new THREE.MeshPhongMaterial({ color: 0xffffff }),  // front (3)
        new THREE.MeshPhongMaterial({ color: 0xffffff })   // back (4)
    ];
    var cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;
    dice.add(cube);
    
    //create dots to represent the numbers (doubled from 1/5 size)
    var dotRadius = 0.032;
    var faceOffset = 0.1388;

    //chatgpt'd this shit i dont have the braincells for ts
    
    // Face 1 (right, +X): 1 dot
    makeDot(dice, faceOffset, 0, 0, dotRadius);
    
    // Face 2 (bottom, -Y): 2 dots
    makeDot(dice, -0.06, -faceOffset, 0.06, dotRadius);
    makeDot(dice, 0.06, -faceOffset, -0.06, dotRadius);
    
    // Face 3 (front, +Z): 3 dots
    makeDot(dice, -0.06, 0.06, faceOffset, dotRadius);
    makeDot(dice, 0, 0, faceOffset, dotRadius);
    makeDot(dice, 0.06, -0.06, faceOffset, dotRadius);
    
    // Face 4 (back, -Z): 4 dots
    makeDot(dice, -0.06, 0.06, -faceOffset, dotRadius);
    makeDot(dice, 0.06, 0.06, -faceOffset, dotRadius);
    makeDot(dice, -0.06, -0.06, -faceOffset, dotRadius);
    makeDot(dice, 0.06, -0.06, -faceOffset, dotRadius);
    
    // Face 5 (top, +Y): 5 dots
    makeDot(dice, -0.06, faceOffset, 0.06, dotRadius);
    makeDot(dice, 0.06, faceOffset, 0.06, dotRadius);
    makeDot(dice, -0.06, faceOffset, -0.06, dotRadius);
    makeDot(dice, 0.06, faceOffset, -0.06, dotRadius);
    makeDot(dice, 0, faceOffset, 0, dotRadius);
    
    // Face 6 (left, -X): 6 dots
    makeDot(dice, -faceOffset, -0.06, 0.06, dotRadius);
    makeDot(dice, -faceOffset, 0.06, 0.06, dotRadius);
    makeDot(dice, -faceOffset, -0.06, -0.06, dotRadius);
    makeDot(dice, -faceOffset, 0.06, -0.06, dotRadius);
    makeDot(dice, -faceOffset, -0.06, 0, dotRadius);
    makeDot(dice, -faceOffset, 0.06, 0, dotRadius);
    
    return dice;
}