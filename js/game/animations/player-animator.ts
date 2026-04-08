// Player movement and animation system
function createPlayerAnimator(playerPiece, targetSpaceId) {
    var animator = {
        playerPiece: playerPiece,
        targetSpaceId: targetSpaceId,
        isAnimating: false,
        animationStartTime: 0,
        animationDuration: 2000,  // 2 seconds to walk
        playerStartPos: null,
        playerTargetPos: null,
        playerWalkPath: [],
        speedMultiplier: 1,

        setSpeedMultiplier: function(multiplier) {
            this.speedMultiplier = Math.max(0.5, Math.min(2.0, multiplier || 1));
        },
        
        init: function() {
            this.playerStartPos = new THREE.Vector3(this.playerPiece.position.x, this.playerPiece.position.y, this.playerPiece.position.z);
            
            // Calculate walking path
            this.calculateWalkPath();
            
            // Start animation
            this.isAnimating = true;
            this.animationStartTime = Date.now();
        },
        
        calculateWalkPath: function() {
            // Get the bounds of the target space
            var spaceBounds = getSpaceBounds(this.targetSpaceId);
            if (!spaceBounds) {
                console.log('No space bounds for space', this.targetSpaceId);
                this.playerWalkPath = [];
                this.playerTargetPos = this.playerStartPos.clone();
                return;
            }
            
            // Calculate center of the space
            var targetX = (spaceBounds.xMin + spaceBounds.xMax) / 2;
            var targetZ = (spaceBounds.zMin + spaceBounds.zMax) / 2;
            this.playerTargetPos = new THREE.Vector3(targetX, this.playerPiece.position.y, targetZ);
            
            console.log('Walking from', this.playerStartPos, 'to', this.playerTargetPos);
            
            // Create a smooth path
            this.playerWalkPath = this.createSmoothPath(this.playerStartPos, this.playerTargetPos, 20);
            console.log('Walk path has', this.playerWalkPath.length, 'points');
        },
        
        createSmoothPath: function(start, end, numPoints) {
            var path = [start.clone()];
            
            // Calculate straight-line distance
            var dx = end.x - start.x;
            var dz = end.z - start.z;
            var distance = Math.sqrt(dx * dx + dz * dz);
            
            console.log('Distance to walk:', distance.toFixed(2));
            
            // If already close enough, just stay in place
            if (distance < 0.1) {
                path.push(end.clone());
                return path;
            }
            
            // Create waypoints along a straight path
            for (var i = 1; i <= numPoints; i++) {
                var t = i / numPoints;
                var x = start.x + dx * t;
                var z = start.z + dz * t;
                
                path.push(new THREE.Vector3(x, start.y, z));
            }
            
            return path;
        },
        
        update: function() {
            if (!this.isAnimating) return false;
            
            var elapsed = (Date.now() - this.animationStartTime) * this.speedMultiplier;
            var progress = Math.min(elapsed / this.animationDuration, 1);
            
            if (progress < 1) {
                this.movePlayerAlongPath(progress);
                this.animatePlayerWalk(progress);
                return true;  // Still animating
            } else {
                this.finishAnimation();
                return false;  // Animation complete
            }
        },
        
        movePlayerAlongPath: function(progress) {
            if (this.playerWalkPath.length < 2) {
                return;
            }
            
            // Calculate position along path based on progress
            var targetIndex = progress * (this.playerWalkPath.length - 1);
            var currentIndex = Math.floor(targetIndex);
            var nextIndex = Math.min(currentIndex + 1, this.playerWalkPath.length - 1);
            var segmentProgress = targetIndex - currentIndex;
            
            // Interpolate between two points on path
            var currentPoint = this.playerWalkPath[currentIndex];
            var nextPoint = this.playerWalkPath[nextIndex];
            
            var newX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
            var newZ = currentPoint.z + (nextPoint.z - currentPoint.z) * segmentProgress;
            
            this.playerPiece.position.x = newX;
            this.playerPiece.position.z = newZ;
            
            // Rotate piece to face direction of movement
            var moveDir = new THREE.Vector3(nextPoint.x - currentPoint.x, 0, nextPoint.z - currentPoint.z);
            if (moveDir.length() > 0.01) {
                var angle = Math.atan2(moveDir.x, moveDir.z);
                this.playerPiece.rotation.y = angle;
            }
        },
        
        animatePlayerWalk: function(progress) {
            // Walking animation - legs swing and body bobs up and down
            var walkSpeed = 8;  // Speed of walking motion
            var walkCycle = (progress * walkSpeed) % 1;  // 0 to 1 repeating cycle
            
            // Iterate through all children of the player piece
            for (var i = 0; i < this.playerPiece.children.length; i++) {
                var child = this.playerPiece.children[i];
                
                // Get original position (stored or use current as baseline)
                if (!child.originalPosition) {
                    child.originalPosition = child.position.clone();
                    child.originalRotation = child.rotation.clone();
                }
                
                // Leg detection by y position
                if (child.originalPosition.y < -0.4) {
                    // Legs - swing them forward and backward
                    var legSwing = Math.sin(walkCycle * Math.PI * 2) * 0.35;
                    if (child.originalPosition.x < 0) {
                        child.rotation.x = child.originalRotation.x + legSwing;
                    } else if (child.originalPosition.x > 0) {
                        child.rotation.x = child.originalRotation.x - legSwing;
                    }
                } else if (child.originalPosition.y > 0.3) {
                    // Head - bob up and down
                    var bobAmount = Math.sin(walkCycle * Math.PI * 2) * 0.1;
                    child.position.y = child.originalPosition.y + bobAmount;
                } else if (child.originalPosition.y > -0.1 && child.originalPosition.y < 0.2) {
                    // Body - slight bob
                    var bodyBob = Math.sin(walkCycle * Math.PI * 2) * 0.06;
                    child.position.y = child.originalPosition.y + bodyBob;
                }
                
                // Arms swing opposite to legs
                if (child.originalPosition.x && Math.abs(child.originalPosition.x) > 0.2 && child.originalPosition.y > -0.2 && child.originalPosition.y < 0.3) {
                    var armSwing = Math.sin(walkCycle * Math.PI * 2) * 0.4;
                    if (child.originalPosition.x < 0) {
                        child.rotation.x = child.originalRotation.x - armSwing;
                    } else if (child.originalPosition.x > 0) {
                        child.rotation.x = child.originalRotation.x + armSwing;
                    }
                }
            }
        },
        
        finishAnimation: function() {
            console.log('Player animation finished');
            this.isAnimating = false;
            
            // Reset all child positions and rotations
            for (var i = 0; i < this.playerPiece.children.length; i++) {
                var child = this.playerPiece.children[i];
                if (child.originalPosition) {
                    child.position.copy(child.originalPosition);
                    child.rotation.copy(child.originalRotation);
                    delete child.originalPosition;
                    delete child.originalRotation;
                }
            }
            
            // Ensure player is at final position
            if (this.playerTargetPos) {
                this.playerPiece.position.x = this.playerTargetPos.x;
                this.playerPiece.position.z = this.playerTargetPos.z;
            }
        }
    };
    
    animator.init();
    return animator;
}
