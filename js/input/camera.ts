// Camera controls and management
function setupCameraControls(camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    type CameraControls = {
        isDragging: boolean;
        previousMouseX: number;
        previousMouseY: number;
        cameraAngleX: number;
        cameraAngleY: number;
        cameraDistance: number;
        updateCamera: () => void;
    };

    const controls: CameraControls = {
        isDragging: false,
        previousMouseX: 0,
        previousMouseY: 0,
        cameraAngleX: 0,
        cameraAngleY: 0.5,
        cameraDistance: 17,
        updateCamera: function() {}
    };

    document.addEventListener('mousedown', function(event) {
        controls.isDragging = true;
        controls.previousMouseX = event.clientX;
        controls.previousMouseY = event.clientY;
    });


    document.addEventListener('mouseup', function() {
        controls.isDragging = false;
    });

    document.addEventListener('mousemove', function(event) {
        if (controls.isDragging) {
            const deltaX = event.clientX - controls.previousMouseX;
            const deltaY = event.clientY - controls.previousMouseY;

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

    controls.updateCamera = function() {
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
