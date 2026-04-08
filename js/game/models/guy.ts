function createGuy(color) {
    var guy = new THREE.Group();
    var bodyColor;
    if (color === "red") {
        bodyColor = 0xdc2626;  // Red
    } else if (color === "blue") {
        bodyColor = 0x3b82f6;  // Blue
    } else if (color === "green") {
        bodyColor = 0x16a34a;  // Green
    } else if (color === "yellow") {
        bodyColor = 0xeab308;  // Yellow
    }
    var symbolColor = 0xffffff;  // White

    // Body
    var body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.8, 0.35),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    body.position.y = 0;
    body.castShadow = true;
    guy.add(body);

    // Head
    var head = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.35),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    head.position.y = 0.575;
    head.castShadow = true;
    guy.add(head);

    // Arms
    var leftArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.75, 0.2),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    leftArm.position.set(-0.375, 0.05, 0);
    leftArm.castShadow = true;
    guy.add(leftArm);

    var rightArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.75, 0.2),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    rightArm.position.set(0.375, 0.05, 0);
    rightArm.castShadow = true;
    guy.add(rightArm);

    // Legs
    var leftLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.6, 0.25),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    leftLeg.position.set(-0.15, -0.55, 0);
    leftLeg.castShadow = true;
    guy.add(leftLeg);

    var rightLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.6, 0.25),
        new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
    );
    rightLeg.position.set(0.15, -0.55, 0);
    rightLeg.castShadow = true;
    guy.add(rightLeg);

    if (color === "red") {
        //letter "A" symbol

        //left of "A"
        var aLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.35, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        aLeft.position.set(-0.12, 0.08, 0);
        aLeft.rotation.z = -0.2;
        aLeft.castShadow = true;
        guy.add(aLeft);

        // Right stroke
        var aRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.35, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        aRight.position.set(0.12, 0.08, 0);
        aRight.rotation.z = 0.2;
        aRight.castShadow = true;
        guy.add(aRight);

        // Crossbar
        var aBar = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        aBar.position.set(0, 0.02, 0);
        aBar.castShadow = true;
        guy.add(aBar);

        var topBar = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        topBar.position.set(0, 0.2, 0);
        topBar.castShadow = true;
        guy.add(topBar);

    } else if (color === "blue") {
        // Left arrow (pointing up-right)
        var arrow1BackSeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow1BackSeg.position.set(.12, -0.07, 0);
        arrow1BackSeg.castShadow = true;
        guy.add(arrow1BackSeg);

        var arrow1FrontSeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow1FrontSeg.position.set(.15, 0, 0);
        arrow1FrontSeg.rotation.z = (Math.PI / 3)*2;
        arrow1FrontSeg.castShadow = true;
        guy.add(arrow1FrontSeg);

        var arrow1Tip1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow1Tip1.position.set(0.17, 0.06, 0);
        arrow1Tip1.rotation.z = (Math.PI / 3)*2 + 1;
        arrow1Tip1.castShadow = true;
        guy.add(arrow1Tip1);

        var arrow1Tip2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow1Tip2.position.set(0.09, 0.04, 0);
        arrow1Tip2.rotation.z = (Math.PI / 3)*2 - 1;
        arrow1Tip2.castShadow = true;
        guy.add(arrow1Tip2);

        // top arrow (pointing down-right)
        var arrow2BackSeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow2BackSeg.position.set(.04, 0.2, 0);
        arrow2BackSeg.rotation.z = (Math.PI / 3)*2;
        arrow2BackSeg.castShadow = true;
        guy.add(arrow2BackSeg);

        var arrow2FrontSeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow2FrontSeg.position.set(-0.04, 0.2, 0);
        arrow2FrontSeg.rotation.z = (Math.PI / 3)*4;
        arrow2FrontSeg.castShadow = true;
        guy.add(arrow2FrontSeg);

        var arrow2Tip1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow2Tip1.position.set(-0.11, 0.18, 0);
        arrow2Tip1.rotation.z = (Math.PI / 3)*4 + 1;
        arrow2Tip1.castShadow = true;
        guy.add(arrow2Tip1);
        
        var arrow2Tip2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow2Tip2.position.set(-0.04, 0.13, 0);
        arrow2Tip2.rotation.z = (Math.PI / 3)*4 - 1;
        arrow2Tip2.castShadow = true;
        guy.add(arrow2Tip2);

        // right arrow (pointing left)
        var arrow3BackSeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow3BackSeg.position.set(-0.14, 0, 0);
        arrow3BackSeg.rotation.z = (Math.PI / 3) * 4;
        arrow3BackSeg.castShadow = true;
        guy.add(arrow3BackSeg);

        var arrow3FrontSeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.08, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow3FrontSeg.position.set(-0.1, -0.07, 0);
        arrow3FrontSeg.castShadow = true;
        guy.add(arrow3FrontSeg);

        var arrow3Tip1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow3Tip1.position.set(-0.04, -0.11, 0);
        arrow3Tip1.rotation.z = 1;
        arrow3Tip1.castShadow = true;
        guy.add(arrow3Tip1);
        
        var arrow3Tip2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        arrow3Tip2.position.set(-0.04, -0.03, 0);
        arrow3Tip2.rotation.z = -1;
        arrow3Tip2.castShadow = true;
        guy.add(arrow3Tip2);


    } else if (color === "green") {
        // Create hollow cylinder with wall thickness using LatheGeometry
        var ribbonBadge = new THREE.Mesh(
            new THREE.LatheGeometry([
                new THREE.Vector2(0.05, -0.2),  // inner bottom
                new THREE.Vector2(0.15, -0.2),  // outer bottom
                new THREE.Vector2(0.15, 0.2),   // outer top
                new THREE.Vector2(0.05, 0.2)    // inner top
            ], 32),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        ribbonBadge.position.set(0, 0.15, 0);
        ribbonBadge.rotation.x = Math.PI / 2;
        ribbonBadge.castShadow = true;
        guy.add(ribbonBadge);

        // Left tail
        var ribbonTailLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.2, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        ribbonTailLeft.position.set(-0.08, -0.05, 0);
        ribbonTailLeft.rotation.z = -0.9;
        ribbonTailLeft.castShadow = true;
        guy.add(ribbonTailLeft);

        // Right tail
        var ribbonTailRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.2, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        ribbonTailRight.position.set(0.08, -0.05, 0);
        ribbonTailRight.rotation.z = 0.9;
        ribbonTailRight.castShadow = true;
        guy.add(ribbonTailRight);

    } else if (color === "yellow") {
        // Upper left segment (pointing up-left)
        var bolt1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.2, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        bolt1.position.set(0.04, 0.18, 0);
        bolt1.rotation.z = 0.35;
        bolt1.castShadow = true;
        guy.add(bolt1);

        // middle segment
        var bolt2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.1, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        bolt2.position.set(0, 0.1, 0);
        bolt2.castShadow = true;
        guy.add(bolt2);

        // Lower middle segment (pointing down-right)
        var bolt3 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.2, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        bolt3.position.set(-0.06, 0.05, 0);
        bolt3.rotation.z = 0.35;
        bolt3.castShadow = true;
        guy.add(bolt3);

        // Bottom point
        var bolt4 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.2, 0.4),
            new THREE.MeshPhongMaterial({ color: symbolColor, flatShading: true })
        );
        bolt4.position.set(0, -0.13, 0);
        bolt4.rotation.z = 0.2;
        bolt4.castShadow = true;
        guy.add(bolt4);
    }

    return guy;
}
