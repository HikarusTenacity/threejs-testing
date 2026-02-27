// Camera controls and management
function setupCameraControls(camera, scene) {
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    // Camera control variables
    var controls = {
        isDragging: false,
        previousMouseX: 0,
        previousMouseY: 0,
        cameraAngleX: 0,
        cameraAngleY: 0.5,
        cameraDistance: 17,
        mouseWorldPos: { x: 0, y: 0, z: 0 }
    };

    // Raycaster for mouse picking
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    
    // Create invisible planes for raycasting
    var castingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
    var intersectionPoint = new THREE.Vector3();

    // Mouse down event
    document.addEventListener('mousedown', function(event) {
        controls.isDragging = true;
        controls.previousMouseX = event.clientX;
        controls.previousMouseY = event.clientY;
    });

    // Mouse up event
    document.addEventListener('mouseup', function() {
        controls.isDragging = false;
    });

    // Mouse move event
    document.addEventListener('mousemove', function(event) {
        // Track mouse position for raycasting
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        if (controls.isDragging) {
            var deltaX = event.clientX - controls.previousMouseX;
            var deltaY = event.clientY - controls.previousMouseY;

            controls.cameraAngleX -= deltaX * 0.005;
            controls.cameraAngleY -= deltaY * 0.005;

            // Limit vertical rotation
            controls.cameraAngleY = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, controls.cameraAngleY));
            
            controls.previousMouseX = event.clientX;
            controls.previousMouseY = event.clientY;
        }
    });

    // Zoom with mouse wheel
    document.addEventListener('wheel', function(event) {
        controls.cameraDistance += event.deltaY * 0.01;
        controls.cameraDistance = Math.max(1, controls.cameraDistance);
    });

    // Update camera function to be called in render loop
    controls.updateCamera = function() {
        // Update raycaster camera
        raycaster.setFromCamera(mouse, camera);
        
        // Cast ray to ground plane
        raycaster.ray.intersectPlane(castingPlane, intersectionPoint);
        controls.mouseWorldPos.x = intersectionPoint.x;
        controls.mouseWorldPos.y = intersectionPoint.y;
        controls.mouseWorldPos.z = intersectionPoint.z;

        // Third-person camera orbit
        camera.position.x = Math.sin(controls.cameraAngleX) * Math.cos(controls.cameraAngleY) * controls.cameraDistance;
        camera.position.y = Math.sin(controls.cameraAngleY) * controls.cameraDistance;
        camera.position.z = Math.cos(controls.cameraAngleX) * Math.cos(controls.cameraAngleY) * controls.cameraDistance;
        camera.lookAt(0, 0, 0);
    };

    return controls;
}
