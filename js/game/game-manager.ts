// Game manager for local 4-player co-op
function createGameManager(scene, camera, worldPieces, rendererDomElement) {
    var manager = {
        currentPlayerIndex: 0,
        gameState: 'PRE_GAME_SELECT',  // PRE_GAME_SELECT, PRE_GAME_ROLL_RESULTS, TURN_START, ROLLING, MOVING, TURN_END
        diceRoll: 0,
        targetSpace: 0,
        isLocalGame: true,
        scene: scene,
        camera: camera,
        worldPieces: worldPieces || [],
        diceAnimator: null,
        selectingPlayerIndex: 0,
        availablePieceIndices: [],
        selectedPieceByPlayer: [],
        selectionCursor: 0,
        pregameRolls: [],
        turnOrder: [],
        hoveredPieceIndex: -1,
        pregameRaycaster: new THREE.Raycaster(),
        pregameMouse: new THREE.Vector2(0, 0),
        pregameExitAnimations: [],
        pregameNameEntry: null,
        pregameNameMessage: '',
        pregameNameCharacters: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!?#',
        pregameNameKeyboardRows: ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ.!?#','1234567890'],
        pregameNameLength: 8,
        animationSpeed: 1,
        rendererDomElement: rendererDomElement,
        
        // Input handler for controllers/keyboard
        inputHandler: null,
        
        init: function() {
            // Initialize dice animator
            var self = this;
            this.diceAnimator = createDiceAnimator(this.scene, this.camera);
            this.diceAnimator.gameManager = self;
            this.diceAnimator.setSpeedMultiplier(this.animationSpeed);

            this.initializeCharacterSelect();
            this.setupPregamePointerHandlers();
            
            // Initialize multi-controller input
            this.inputHandler = createLocalMultiplayerInput();
            this.inputHandler.init();
            
            // Bind input actions
            var self = this;
            this.inputHandler.onActionForPlayer = function(playerId, action) {
                self.handlePlayerAction(playerId, action);
            };
            this.inputHandler.onRawKeyInput = function(key, event) {
                return self.handleRawKeyboardInput(key, event);
            };
        },
        
        update: function() {
            if (this.inputHandler) {
                this.inputHandler.update();
                this.updateActionButton();
            }
            
            // Update dice animator
            if (this.diceAnimator) {
                this.diceAnimator.update();
            }

            this.updatePregameExitAnimations();
            
            // Update game state based on current player
            this.updateGameState();
        },

        updateActionButton: function() {
            if (!this.inputHandler || !this.inputHandler.actionButton) return;
            
            switch(this.gameState) {
                case 'PRE_GAME_SELECT':
                    if (this.isNameEntryActive()) {
                        this.inputHandler.setButtonText('Confirm');
                        this.inputHandler.setButtonColor('blue');
                    } else {
                        this.inputHandler.setButtonText('Select Character');
                        this.inputHandler.setButtonColor('green');
                    }
                    break;
                case 'PRE_GAME_ROLL_RESULTS':
                    this.inputHandler.setButtonText('Start Game');
                    this.inputHandler.setButtonColor('green');
                    break;
                case 'TURN_START':
                    this.inputHandler.setButtonText('Roll Dice');
                    this.inputHandler.setButtonColor('orange');
                    break;
                case 'ROLLING':
                    this.inputHandler.setButtonText('Rolling...');
                    this.inputHandler.setButtonColor('blue');
                    break;
                case 'MOVING':
                    this.inputHandler.setButtonText('End Turn');
                    this.inputHandler.setButtonColor('red');
                    break;
                case 'TURN_END':
                    this.inputHandler.setButtonText('Next Turn');
                    this.inputHandler.setButtonColor('green');
                    break;
            }
        },
        
        updateGameState: function() {
            // Manage game flow
            switch(this.gameState) {
                case 'PRE_GAME_SELECT':
                case 'PRE_GAME_ROLL_RESULTS':
                    break;
                case 'TURN_START':
                    // Wait for player to roll
                    break;
                case 'ROLLING':
                    // Wait for animation to finish
                    if (!this.diceAnimator.isAnimating) {
                        // Animation finished, move to MOVING state
                        this.gameState = 'MOVING';
                    }
                    break;
                case 'MOVING':
                    // Wait for move input
                    break;
                case 'TURN_END':
                    // Move to next player
                    this.endTurn();
                    break;
            }
        },
        
        handlePlayerAction: function(playerId, action) {
            if (action === 'ACTION') {
                action = 'ROLL';
            }

            // For local multiplayer, any input goes to current player
            if ((this.gameState === 'TURN_START' || this.gameState === 'ROLLING' || this.gameState === 'MOVING' || this.gameState === 'TURN_END') &&
                playerId !== 'ANY' && playerId !== this.currentPlayerIndex) {
                return;
            }

            if (this.gameState === 'PRE_GAME_SELECT') {
                if (this.isNameEntryActive()) {
                    if (action === 'SELECT_PREV') {
                        this.changeNameEntryCharacter(-1);
                    } else if (action === 'SELECT_NEXT') {
                        this.changeNameEntryCharacter(1);
                    } else if (action === 'SELECT_UP') {
                        this.moveNameEntryCursor(-1);
                    } else if (action === 'SELECT_DOWN') {
                        this.moveNameEntryCursor(1);
                    } else if (action === 'ROLL') {
                        this.confirmNameEntry();
                    }
                } else if (action === 'SELECT_PREV') {
                    this.moveSelectionCursor(-1);
                } else if (action === 'SELECT_NEXT') {
                    this.moveSelectionCursor(1);
                } else if (action === 'ROLL') {
                    this.confirmCharacterSelection();
                }
                return;
            }

            if (this.gameState === 'PRE_GAME_ROLL_RESULTS') {
                if (action === 'ROLL') {
                    this.startGameAfterPregame();
                }
                return;
            }
            
            if (action === 'ROLL') {
                if (this.gameState === 'TURN_START') {
                    this.startRolling();
                } else if (this.gameState === 'MOVING') {
                    this.endTurn();
                }
            }
        },

        handleRawKeyboardInput: function(key, event) {
            // Keyboard input disabled - use mouse and action button only
            return false;
        },

        initializeCharacterSelect: function() {
            this.availablePieceIndices = [];
            this.selectedPieceByPlayer = [];
            this.selectingPlayerIndex = 0;
            this.selectionCursor = 0;
            this.hoveredPieceIndex = -1;
            this.pregameExitAnimations = [];
            this.pregameNameMessage = '';

            for (var i = 0; i < this.worldPieces.length; i++) {
                this.availablePieceIndices.push(i);
            }

            for (var i = 0; i < PLAYERS.length; i++) {
                this.selectedPieceByPlayer.push(-1);
                PLAYERS[i].piece = null;
            }

            this.initNameEntryForCurrentPlayer();

            this.layoutCharacterSelectPieces();
        },

        setupPregamePointerHandlers: function() {
            if (!this.rendererDomElement) {
                return;
            }

            var self = this;

            this.rendererDomElement.addEventListener('mousemove', function(event) {
                self.handlePregameMouseMove(event);
            });

            this.rendererDomElement.addEventListener('mouseleave', function() {
                self.setHoveredPieceIndex(-1);
            });

            this.rendererDomElement.addEventListener('click', function(event) {
                self.handleClick(event);
            });
        },

        handlePregameMouseMove: function(event) {
            if (this.gameState !== 'PRE_GAME_SELECT' || this.isNameEntryActive()) {
                this.setHoveredPieceIndex(-1);
                return;
            }

            var rect = this.rendererDomElement.getBoundingClientRect();
            this.pregameMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pregameMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.pregameRaycaster.setFromCamera(this.pregameMouse, this.camera);

            var availableRoots = [];
            for (var i = 0; i < this.availablePieceIndices.length; i++) {
                availableRoots.push(this.worldPieces[this.availablePieceIndices[i]]);
            }

            var intersections = this.pregameRaycaster.intersectObjects(availableRoots, true);
            if (intersections.length === 0) {
                this.setHoveredPieceIndex(-1);
                return;
            }

            var hoveredIndex = this.resolvePieceIndexFromObject(intersections[0].object);
            this.setHoveredPieceIndex(hoveredIndex);
        },

        handlePregameClick: function() {
            if (this.gameState !== 'PRE_GAME_SELECT' || this.isNameEntryActive()) {
                return;
            }

            if (this.hoveredPieceIndex >= 0) {
                if (this.isNameEntryActive() && !this.confirmNameEntry()) {
                    return;
                }
                this.confirmCharacterSelectionByPieceIndex(this.hoveredPieceIndex);
            }
        },
        
        handleClick: function(event) {
            // Check if pregame selection
            if (this.gameState === 'PRE_GAME_SELECT') {
                this.handlePregameClick();
                return;
            }
            
            // Check if dice animator needs the click
            if (this.diceAnimator && this.gameState === 'ROLLING') {
                var rect = this.rendererDomElement.getBoundingClientRect();
                var mouse = new THREE.Vector2();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                var raycaster = new THREE.Raycaster();
                this.diceAnimator.handleClick(mouse, raycaster);
            }
        },

        resolvePieceIndexFromObject: function(object3D) {
            var cursor = object3D;
            while (cursor) {
                for (var i = 0; i < this.worldPieces.length; i++) {
                    if (this.worldPieces[i] === cursor) {
                        return i;
                    }
                }
                cursor = cursor.parent;
            }
            return -1;
        },

        setHoveredPieceIndex: function(pieceIndex) {
            if (pieceIndex === this.hoveredPieceIndex) {
                return;
            }

            if (this.hoveredPieceIndex >= 0) {
                this.setPieceGlow(this.worldPieces[this.hoveredPieceIndex], false);
            }

            this.hoveredPieceIndex = pieceIndex;

            if (this.hoveredPieceIndex >= 0) {
                this.setPieceGlow(this.worldPieces[this.hoveredPieceIndex], true);
                var cursorInAvailable = this.availablePieceIndices.indexOf(this.hoveredPieceIndex);
                if (cursorInAvailable >= 0) {
                    this.selectionCursor = cursorInAvailable;
                }
            }
        },

        setPieceGlow: function(piece, glowOn) {
            if (!piece) {
                return;
            }

            if (glowOn) {
                // Add outline to piece
                if (!piece.userData.outlineObjects) {
                    piece.userData.outlineObjects = [];
                }
                
                // Only add outlines if not already added
                if (piece.userData.outlineObjects.length === 0) {
                    piece.traverse(function(node) {
                        if (!node.isMesh || !node.geometry) {
                            return;
                        }
                        
                        // Check if geometry is large enough to be a body part (exclude chest symbols)
                        var box = new THREE.Box3().setFromObject(node);
                        var size = box.getSize(new THREE.Vector3());
                        
                        // Calculate volume - body parts have much larger volume than symbols
                        var volume = size.x * size.y * size.z;
                        if (volume < 0.025) {
                            return;
                        }
                        
                        // Create edges geometry from the mesh
                        var edges = new THREE.EdgesGeometry(node.geometry);
                        var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ 
                            color: 0xffffff, 
                            linewidth: 2,
                            fog: false
                        }));
                        node.add(line);
                        piece.userData.outlineObjects.push({ mesh: node, line: line });
                    });
                    
                    // Add an emissive light to illuminate the lines
                    if (!piece.userData.outlineLight) {
                        var light = new THREE.PointLight(0xffffff, 2.5, 50);
                        light.position.copy(piece.position);
                        light.position.y += 5;
                        piece.add(light);
                        piece.userData.outlineLight = light;
                    }
                }
            } else {
                // Remove outlines
                if (piece.userData.outlineObjects) {
                    for (var i = 0; i < piece.userData.outlineObjects.length; i++) {
                        var obj = piece.userData.outlineObjects[i];
                        obj.mesh.remove(obj.line);
                    }
                    piece.userData.outlineObjects = [];
                }
                
                // Remove light
                if (piece.userData.outlineLight) {
                    piece.remove(piece.userData.outlineLight);
                    piece.userData.outlineLight = null;
                }
            }
        },

        moveSelectionCursor: function(direction) {
            if (this.availablePieceIndices.length === 0) {
                return;
            }

            var next = this.selectionCursor + direction;
            if (next < 0) {
                next = this.availablePieceIndices.length - 1;
            }
            if (next >= this.availablePieceIndices.length) {
                next = 0;
            }
            this.selectionCursor = next;
            this.layoutCharacterSelectPieces();
        },

        confirmCharacterSelection: function() {
            if (this.availablePieceIndices.length === 0) {
                return;
            }

            var pieceIndex = this.availablePieceIndices[this.selectionCursor];
            this.confirmCharacterSelectionByPieceIndex(pieceIndex);
        },

        confirmCharacterSelectionByPieceIndex: function(pieceIndex) {
            var availableIndex = this.availablePieceIndices.indexOf(pieceIndex);
            if (availableIndex < 0) {
                return;
            }

            this.selectionCursor = availableIndex;
            var playerIndex = this.selectingPlayerIndex;
            var piece = this.worldPieces[pieceIndex];

            this.setPieceGlow(piece, false);
            this.hoveredPieceIndex = -1;

            setPlayerPiece(playerIndex, piece);
            PLAYERS[playerIndex].pieceType = 'Character ' + (pieceIndex + 1);
            this.selectedPieceByPlayer[playerIndex] = pieceIndex;

            this.availablePieceIndices.splice(availableIndex, 1);
            if (this.selectionCursor >= this.availablePieceIndices.length) {
                this.selectionCursor = Math.max(0, this.availablePieceIndices.length - 1);
            }

            this.startPieceExitAnimation(piece, playerIndex);

            this.selectingPlayerIndex += 1;

            if (this.selectingPlayerIndex >= PLAYERS.length) {
                this.rollPregameOrder();
            } else {
                this.initNameEntryForCurrentPlayer();
                this.layoutCharacterSelectPieces();
            }
        },

        normalizePlayerName: function(rawName) {
            if (typeof rawName !== 'string') {
                return '';
            }

            var trimmed = rawName.toUpperCase().trim();
            if (!trimmed) {
                return '';
            }

            if (trimmed.length > this.pregameNameLength) {
                trimmed = trimmed.slice(0, this.pregameNameLength);
            }

            return trimmed;
        },

        isNameEntryActive: function() {
            return this.gameState === 'PRE_GAME_SELECT' &&
                this.selectingPlayerIndex < PLAYERS.length &&
                !!this.pregameNameEntry;
        },

        initNameEntryForCurrentPlayer: function() {
            if (this.selectingPlayerIndex >= PLAYERS.length) {
                this.pregameNameEntry = null;
                return;
            }

            var playerIndex = this.selectingPlayerIndex;
            var slots = [];

            // Start with empty slots
            for (var i = 0; i < this.pregameNameLength; i++) {
                slots.push(' ');
            }

            this.pregameNameEntry = {
                playerIndex: playerIndex,
                slots: slots,
                cursor: 0
            };
            this.pregameNameMessage = '';
        },

        getNameEntryDisplayText: function() {
            if (!this.isNameEntryActive()) {
                return '';
            }

            var entry = this.pregameNameEntry;
            var out = '';
            for (var i = 0; i < entry.slots.length; i++) {
                var slotChar = entry.slots[i] === ' ' ? '_' : entry.slots[i];
                if (i === entry.cursor) {
                    out += '[' + slotChar + ']';
                } else {
                    out += ' ' + slotChar + ' ';
                }
            }

            return out;
        },

        getNameEntrySelectedCharacter: function() {
            if (!this.isNameEntryActive()) {
                return ' ';
            }

            return this.pregameNameEntry.slots[this.pregameNameEntry.cursor] || ' ';
        },

        moveNameEntryCursor: function(delta) {
            if (!this.isNameEntryActive()) {
                return;
            }

            var entry = this.pregameNameEntry;
            var next = entry.cursor + delta;
            if (next < 0) {
                next = this.pregameNameLength - 1;
            }
            if (next >= this.pregameNameLength) {
                next = 0;
            }
            entry.cursor = next;
        },

        changeNameEntryCharacter: function(delta) {
            if (!this.isNameEntryActive()) {
                return;
            }

            var entry = this.pregameNameEntry;
            var chars = this.pregameNameCharacters;
            var currentChar = entry.slots[entry.cursor] || ' ';
            var index = chars.indexOf(currentChar);
            if (index < 0) {
                index = 0;
            }

            var nextIndex = index + delta;
            if (nextIndex < 0) {
                nextIndex = chars.length - 1;
            }
            if (nextIndex >= chars.length) {
                nextIndex = 0;
            }

            entry.slots[entry.cursor] = chars.charAt(nextIndex);
        },

        setNameEntryCursor: function(cursorIndex) {
            if (!this.isNameEntryActive()) {
                return false;
            }

            if (cursorIndex < 0 || cursorIndex >= this.pregameNameLength) {
                return false;
            }

            this.pregameNameEntry.cursor = cursorIndex;
            return true;
        },

        setNameEntryCharacter: function(character) {
            if (!this.isNameEntryActive()) {
                return false;
            }

            var normalizedChar = character === '_' ? ' ' : character;
            if (typeof normalizedChar !== 'string' || normalizedChar.length === 0) {
                return false;
            }

            normalizedChar = normalizedChar.charAt(0).toUpperCase();
            if (this.pregameNameCharacters.indexOf(normalizedChar) < 0) {
                return false;
            }

            this.pregameNameEntry.slots[this.pregameNameEntry.cursor] = normalizedChar;
            return true;
        },

        deleteNameEntryCharacter: function() {
            if (!this.isNameEntryActive()) {
                return false;
            }

            var entry = this.pregameNameEntry;
            var cursor = entry.cursor;

            // Backspace behavior: clear current slot, or previous slot if current is already empty.
            if (entry.slots[cursor] !== ' ') {
                entry.slots[cursor] = ' ';
                return true;
            }

            var previous = cursor - 1;
            if (previous < 0) {
                previous = this.pregameNameLength - 1;
            }

            entry.cursor = previous;
            entry.slots[previous] = ' ';
            return true;
        },

        confirmNameEntry: function() {
            if (!this.isNameEntryActive()) {
                return false;
            }

            var entry = this.pregameNameEntry;
            var name = this.normalizePlayerName(entry.slots.join(''));
            
            // If name is blank, use default name
            if (!name) {
                name = 'player_' + (entry.playerIndex + 1);
            }

            if (this.isPlayerNameTaken(name, entry.playerIndex)) {
                this.pregameNameMessage = 'Name already used by another player.';
                return false;
            }

            PLAYERS[entry.playerIndex].name = name;
            this.pregameNameEntry = null;
            this.pregameNameMessage = '';
            
            // Move to next player
            this.selectingPlayerIndex += 1;
            
            if (this.selectingPlayerIndex >= PLAYERS.length) {
                // All players done with setup, roll for turn order
                this.rollPregameOrder();
            }
            // If there are more players, the game loop will naturally show character selection for the next player
            
            return true;
        },

        isPlayerNameTaken: function(candidateName, currentPlayerIndex) {
            var lowerCandidate = candidateName.toLowerCase();
            for (var i = 0; i < PLAYERS.length; i++) {
                if (i === currentPlayerIndex) {
                    continue;
                }

                var existingName = this.normalizePlayerName(PLAYERS[i].name);
                if (existingName && existingName.toLowerCase() === lowerCandidate) {
                    return true;
                }
            }

            return false;
        },

        startPieceExitAnimation: function(piece, playerIndex) {
            this.pregameExitAnimations.push({
                piece: piece,
                startX: piece.position.x,
                startZ: piece.position.z,
                endX: -12 + playerIndex * 8,
                endZ: 16,
                startTime: Date.now(),
                duration: 550
            });
        },

        updatePregameExitAnimations: function() {
            if (this.pregameExitAnimations.length === 0) {
                return;
            }

            var now = Date.now();
            for (var i = this.pregameExitAnimations.length - 1; i >= 0; i--) {
                var anim = this.pregameExitAnimations[i];
                var speed = Math.max(0.25, this.animationSpeed || 1);
                var progress = Math.min(((now - anim.startTime) * speed) / anim.duration, 1);
                var eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                anim.piece.position.x = anim.startX + (anim.endX - anim.startX) * eased;
                anim.piece.position.z = anim.startZ + (anim.endZ - anim.startZ) * eased;
                anim.piece.rotation.y = Math.PI * 1.5;

                if (progress >= 1) {
                    this.pregameExitAnimations.splice(i, 1);
                }
            }
        },

        rollPregameOrder: function() {
            this.pregameRolls = [];
            this.turnOrder = [];

            for (var i = 0; i < PLAYERS.length; i++) {
                var roll = Math.floor(Math.random() * 6) + 1;
                this.pregameRolls.push({ playerIndex: i, roll: roll });
            }

            var sorted = this.pregameRolls.slice().sort(function(a, b) {
                if (b.roll !== a.roll) {
                    return b.roll - a.roll;
                }
                return a.playerIndex - b.playerIndex;
            });

            for (var j = 0; j < sorted.length; j++) {
                this.turnOrder.push(sorted[j].playerIndex);
            }

            this.currentPlayerIndex = this.turnOrder[0] || 0;
            this.gameState = 'PRE_GAME_ROLL_RESULTS';
            this.layoutCharacterSelectPieces();
        },

        startGameAfterPregame: function() {
            for (var i = 0; i < PLAYERS.length; i++) {
                movePlayerToSpace(i, 0);
            }
            updateAllPiecePositions();
            this.gameState = 'TURN_START';
        },

        layoutCharacterSelectPieces: function() {
            var availableCount = this.availablePieceIndices.length;
            var availableSpacing = 2.2;
            var availableStartX = -((availableCount - 1) * availableSpacing) / 2;
            var availableZ = 0.9;

            for (var i = 0; i < this.worldPieces.length; i++) {
                var piece = this.worldPieces[i];
                if (!piece.userData.baseScale) {
                    piece.userData.baseScale = piece.scale.clone();
                }
                piece.scale.copy(piece.userData.baseScale);
            }

            for (var k = 0; k < this.availablePieceIndices.length; k++) {
                var availablePieceIndex = this.availablePieceIndices[k];
                var availablePiece = this.worldPieces[availablePieceIndex];
                availablePiece.position.x = availableStartX + k * availableSpacing;
                availablePiece.position.z = availableZ;
                availablePiece.rotation.y = Math.PI;

                if (this.gameState === 'PRE_GAME_SELECT' && k === this.selectionCursor) {
                    availablePiece.scale.multiplyScalar(1.18);
                }
            }
        },

        isPregame: function() {
            return this.gameState === 'PRE_GAME_SELECT' || this.gameState === 'PRE_GAME_ROLL_RESULTS';
        },
        
        startRolling: function() {
            // Start turn cutscene with player info
            this.gameState = 'ROLLING';
            var currentPlayer = PLAYERS[this.currentPlayerIndex];
            
            // Roll dice
            this.diceRoll = Math.floor(Math.random() * 6) + 1;
            
            // Calculate target space
            this.targetSpace = (currentPlayer.currentSpace + this.diceRoll) % 40;
            
            // Update player space immediately so positioning works correctly
            movePlayerToSpace(this.currentPlayerIndex, this.targetSpace);
            
            // Start animation
            this.diceAnimator.rollDice(
                currentPlayer.name,
                currentPlayer.color,
                currentPlayer.piece,
                this.targetSpace,
                this.diceRoll
            );
        },
        
        endTurn: function() {
            if (this.turnOrder.length > 0) {
                var currentTurnOrderIndex = this.turnOrder.indexOf(this.currentPlayerIndex);
                var nextOrderIndex = (currentTurnOrderIndex + 1) % this.turnOrder.length;
                this.currentPlayerIndex = this.turnOrder[nextOrderIndex];
            } else {
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
            }
            this.gameState = 'TURN_START';
            this.diceRoll = 0;
        },
        
        getCurrentPlayer: function() {
            return PLAYERS[this.currentPlayerIndex];
        },

        setGameSpeed: function(multiplier) {
            this.animationSpeed = Math.max(0.5, Math.min(2.0, multiplier || 1));

            if (this.diceAnimator && this.diceAnimator.setSpeedMultiplier) {
                this.diceAnimator.setSpeedMultiplier(this.animationSpeed);
            }
        }
    };
    
    manager.init();
    return manager;
}
