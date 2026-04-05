// Camera controls and management
function setupCameraControls(camera, scene) {
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    var controls = {
        isDragging: false,
        previousMouseX: 0,
        previousMouseY: 0,
        cameraAngleX: 0,
        cameraAngleY: 0.5,
        cameraDistance: 17
    };

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
        if (controls.isDragging) {
            var deltaX = event.clientX - controls.previousMouseX;
            var deltaY = event.clientY - controls.previousMouseY;

            controls.cameraAngleX -= deltaX * 0.005;
            controls.cameraAngleY -= deltaY * 0.005;

            // Limit vertical rotation
            controls.cameraAngleY = Math.max(
                0.01, 
                Math.min(
                    Math.PI / 2 - 0.01, 
                    controls.cameraAngleY
                )
            );
            
            controls.previousMouseX = event.clientX;
            controls.previousMouseY = event.clientY;
        }
    });

    // Zoom with mouse wheel
    document.addEventListener('wheel', function(event) {
        controls.cameraDistance += event.deltaY * 0.01;
        controls.cameraDistance = Math.max(1, controls.cameraDistance); //clamp
    });

    // Update camera function to be called in render loop
    controls.updateCamera = function() {
        // Third-person camera orbit
        camera.position.x = (
            Math.sin(controls.cameraAngleX) *
            Math.cos(controls.cameraAngleY) * 
            controls.cameraDistance
        );
        camera.position.y = (
            Math.sin(controls.cameraAngleY) * 
            controls.cameraDistance
        );
        camera.position.z = (
            Math.cos(controls.cameraAngleX) * 
            Math.cos(controls.cameraAngleY) * 
            controls.cameraDistance
        );
        camera.lookAt(0, 0, 0);
    };

    return controls;
}
