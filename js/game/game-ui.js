// Game UI for displaying turn info and player status
function createGameUI(infoDiv) {
    var cornerPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    var fallbackGuyColors = ['red', 'green', 'blue', 'yellow'];
    var portraitWidth = 106;
    var portraitHeight = 100;
    var ui = {
        infoDiv: infoDiv,
        cornerPanels: [],
        portraitViewports: [],
        nameEntryOverlay: null,
        activeGameManager: null,
        lastUpdate: 0,
        updateInterval: 100,  // Update every 100ms
        lastSelectedKey: null,
        lastCursorPosition: -1,
        lastPlayerIndex: -1,
        lastSlotContent: '',

        init: function() {
            this.createCornerPanels();
            this.createNameEntryOverlay();
        },

        createNameEntryOverlay: function() {
            console.log('Creating name entry overlay');
            if (this.nameEntryOverlay && this.nameEntryOverlay.root && this.nameEntryOverlay.root.parentNode) {
                this.nameEntryOverlay.root.parentNode.removeChild(this.nameEntryOverlay.root);
            }

            var root = document.createElement('div');
            root.className = 'arcade-name-overlay hidden';

            var title = document.createElement('div');
            title.className = 'arcade-name-title';
            root.appendChild(title);

            var slots = document.createElement('div');
            slots.className = 'arcade-name-slots';
            root.appendChild(slots);

            var keyboard = document.createElement('div');
            keyboard.className = 'arcade-name-keyboard';
            root.appendChild(keyboard);

            var message = document.createElement('div');
            message.className = 'arcade-name-message';
            root.appendChild(message);

            var confirmButton = document.createElement('button');
            confirmButton.className = 'arcade-name-confirm';
            confirmButton.type = 'button';
            confirmButton.textContent = 'Confirm Name';
            root.appendChild(confirmButton);

            var controls = document.createElement('div');
            controls.className = 'arcade-name-controls';
            controls.textContent = 'Click on letters to enter name, click slots to edit, then click the Confirm Name button';
            root.appendChild(controls);

            slots.addEventListener('click', this.handleNameSlotClick.bind(this));
            keyboard.addEventListener('click', this.handleNameKeyClick.bind(this));
            confirmButton.addEventListener('click', this.handleNameConfirmClick.bind(this));
            console.log('Confirm button event listener attached');

            document.body.appendChild(root);
            this.nameEntryOverlay = {
                root: root,
                title: title,
                slots: slots,
                keyboard: keyboard,
                message: message,
                confirmButton: confirmButton
            };
            console.log('Name entry overlay created and added to DOM');
        },

        updateNameEntryOverlay: function(gameManager) {
            if (!this.nameEntryOverlay) {
                return;
            }

            this.activeGameManager = gameManager;

            var overlay = this.nameEntryOverlay;
            var showOverlay = gameManager.gameState === 'PRE_GAME_SELECT' &&
                gameManager.isNameEntryActive &&
                gameManager.isNameEntryActive();

            // Only log occasionally to avoid spam
            if (Math.random() < 0.1) {
                console.log('Overlay check - gameState:', gameManager.gameState, 'isNameEntryActive method:', !!gameManager.isNameEntryActive, 'isNameEntryActive():', gameManager.isNameEntryActive ? gameManager.isNameEntryActive() : 'N/A', 'showOverlay:', showOverlay);
            }

            if (!showOverlay) {
                overlay.root.classList.add('hidden');
                // Reset tracking variables when hidden
                this.lastSelectedKey = null;
                this.lastCursorPosition = -1;
                this.lastPlayerIndex = -1;
                this.lastSlotContent = '';
                return;
            }

            var playerNumber = gameManager.selectingPlayerIndex + 1;
            overlay.root.classList.remove('hidden');
            
            // Only update title if player changed
            if (this.lastPlayerIndex !== gameManager.selectingPlayerIndex) {
                overlay.title.textContent = 'PLAYER ' + playerNumber + ' NAME ENTRY';
                this.lastPlayerIndex = gameManager.selectingPlayerIndex;
            }

            var entry = gameManager.pregameNameEntry;
            var currentCursor = entry ? entry.cursor : -1;
            var currentSlotContent = entry ? entry.slots.join('') : '';
            
            // Only rebuild slots if cursor position or content changed
            if (this.lastCursorPosition !== currentCursor || this.lastSlotContent !== currentSlotContent) {
                var slotsHtml = '';
                if (entry) {
                    for (var i = 0; i < entry.slots.length; i++) {
                        var slotChar = entry.slots[i] === ' ' ? '_' : entry.slots[i];
                        var activeClass = i === entry.cursor ? ' active' : '';
                        slotsHtml += '<div class="arcade-name-slot' + activeClass + '" data-slot-index="' + i + '">' + slotChar + '</div>';
                    }
                }
                overlay.slots.innerHTML = slotsHtml;
                this.lastCursorPosition = currentCursor;
                this.lastSlotContent = currentSlotContent;
            }

            var selectedKey = gameManager.getNameEntrySelectedCharacter ? gameManager.getNameEntrySelectedCharacter() : ' ';
            
            // Only rebuild keyboard if selected key changed
            if (this.lastSelectedKey !== selectedKey) {
                var keyboardHtml = '';
                var rows = gameManager.pregameNameKeyboardRows || [];
                for (var r = 0; r < rows.length; r++) {
                    keyboardHtml += '<div class="arcade-name-keyboard-row">';
                    var row = rows[r];
                    for (var k = 0; k < row.length; k++) {
                        var keyChar = row.charAt(k);
                        var keyLabel = keyChar === ' ' ? '_' : keyChar;
                        var selectedClass = keyChar === selectedKey ? ' selected' : '';
                        keyboardHtml += '<div class="arcade-name-key' + selectedClass + '" data-char-code="' + keyChar.charCodeAt(0) + '">' + keyLabel + '</div>';
                    }
                    keyboardHtml += '</div>';
                }
                overlay.keyboard.innerHTML = keyboardHtml;
                this.lastSelectedKey = selectedKey;
            }

            overlay.message.textContent = gameManager.pregameNameMessage || '';
        },

        handleNameSlotClick: function(event) {
            if (!this.activeGameManager || !this.activeGameManager.isNameEntryActive || !this.activeGameManager.isNameEntryActive()) {
                return;
            }

            var slot = event.target.closest('.arcade-name-slot');
            if (!slot) {
                return;
            }

            var slotIndex = parseInt(slot.getAttribute('data-slot-index'), 10);
            if (isNaN(slotIndex) || !this.activeGameManager.setNameEntryCursor) {
                return;
            }

            this.activeGameManager.setNameEntryCursor(slotIndex);
        },

        handleNameKeyClick: function(event) {
            if (!this.activeGameManager || !this.activeGameManager.isNameEntryActive || !this.activeGameManager.isNameEntryActive()) {
                return;
            }

            var key = event.target.closest('.arcade-name-key');
            if (!key) {
                return;
            }

            var charCode = parseInt(key.getAttribute('data-char-code'), 10);
            if (isNaN(charCode) || !this.activeGameManager.setNameEntryCharacter) {
                return;
            }

            var charValue = String.fromCharCode(charCode);
            if (!this.activeGameManager.setNameEntryCharacter(charValue)) {
                return;
            }

            if (this.activeGameManager.moveNameEntryCursor) {
                this.activeGameManager.moveNameEntryCursor(1);
            }
        },

        handleNameConfirmClick: function() {
            console.log('Confirm button clicked');
            
            // Check each condition separately for debugging
            var hasActiveGameManager = !!this.activeGameManager;
            var hasIsNameEntryActiveMethod = hasActiveGameManager && typeof this.activeGameManager.isNameEntryActive === 'function';
            var isNameEntryActiveResult = hasIsNameEntryActiveMethod ? this.activeGameManager.isNameEntryActive() : null;
            
            console.log('activeGameManager:', hasActiveGameManager);
            console.log('isNameEntryActive method exists:', hasIsNameEntryActiveMethod);
            console.log('isNameEntryActive() returns:', isNameEntryActiveResult);
            console.log('confirmNameEntry method exists:', hasActiveGameManager && typeof this.activeGameManager.confirmNameEntry === 'function');
            
            if (!this.activeGameManager) {
                console.log('Returning: no active game manager');
                return;
            }
            
            if (!this.activeGameManager.isNameEntryActive) {
                console.log('Returning: isNameEntryActive method missing');
                return;
            }
            
            if (!this.activeGameManager.isNameEntryActive()) {
                console.log('Returning: isNameEntryActive() returned false');
                return;
            }

            console.log('All checks passed, calling confirmNameEntry()');
            if (this.activeGameManager.confirmNameEntry) {
                var result = this.activeGameManager.confirmNameEntry();
                console.log('confirmNameEntry returned:', result);
            } else {
                console.log('confirmNameEntry method does not exist!');
            }
        },

        createCornerPanels: function() {
            this.destroyCornerPanels();

            for (var i = 0; i < 4; i++) {
                var panel = document.createElement('div');
                panel.className = 'player-corner ' + cornerPositions[i];
                panel.id = 'player-corner-' + i;

                var header = document.createElement('div');
                header.className = 'player-corner-header';

                var portrait = document.createElement('span');
                portrait.className = 'player-portrait';
                portrait.innerHTML =
                    '<span class="paper-doll">' +
                        '<span class="paper-doll-head"></span>' +
                        '<span class="paper-doll-body"></span>' +
                    '</span>';

                var name = document.createElement('span');
                name.className = 'player-corner-name';

                header.appendChild(portrait);
                header.appendChild(name);

                var characterLine = document.createElement('div');
                var currencyLine = document.createElement('div');
                var buffsLine = document.createElement('div');

                panel.appendChild(header);
                panel.appendChild(characterLine);
                panel.appendChild(currencyLine);
                panel.appendChild(buffsLine);

                document.body.appendChild(panel);
                this.cornerPanels.push({
                    panel: panel,
                    header: header,
                    portrait: portrait,
                    name: name,
                    characterLine: characterLine,
                    currencyLine: currencyLine,
                    buffsLine: buffsLine
                });

                this.createPortraitViewport(i);
            }
        },

        createPortraitViewport: function(index) {
            if (typeof THREE === 'undefined' || !this.cornerPanels[index]) {
                return;
            }

            var portraitHost = this.cornerPanels[index].portrait;
            var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setSize(portraitWidth, portraitHeight, false);
            renderer.setClearColor(0x000000, 0);
            renderer.domElement.className = 'portrait-canvas';

            portraitHost.innerHTML = '';
            portraitHost.appendChild(renderer.domElement);

            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(42, portraitWidth / portraitHeight, 0.1, 20);
            camera.position.set(0, 0.65, 2.1);
            camera.lookAt(new THREE.Vector3(0, 0.35, 0));

            var ambient = new THREE.AmbientLight(0xffffff, 0.9);
            scene.add(ambient);

            var keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
            keyLight.position.set(2.5, 3.5, 3.5);
            scene.add(keyLight);

            var rimLight = new THREE.PointLight(0xffffff, 1.5, 8);
            rimLight.position.set(-2, 2, 2);
            scene.add(rimLight);

            this.portraitViewports[index] = {
                renderer: renderer,
                scene: scene,
                camera: camera,
                rimLight: rimLight,
                model: null,
                sourcePiece: null,
                baseY: -0.20
            };
        },

        getPortraitModelForPlayer: function(player, index) {
            var model;

            if (player.piece) {
                model = player.piece.clone(true);
            } else {
                model = createGuy(fallbackGuyColors[index % fallbackGuyColors.length]);
            }

            model.position.set(0, 0, 0);
            model.rotation.set(0, 0, 0);

            model.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = false;
                    node.receiveShadow = false;
                }
            });

            var box = new THREE.Box3().setFromObject(model);
            var center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            box.setFromObject(model);
            var size = box.getSize(new THREE.Vector3());
            if (size.y > 0) {
                var scale = 2.35 / size.y;
                model.scale.set(scale, scale, scale);
            }

            box.setFromObject(model);
            var scaledSize = box.getSize(new THREE.Vector3());
            var scaledMinY = box.min.y;
            var chestY = scaledMinY + scaledSize.y * 0.65;
            model.position.y -= chestY;
            model.position.y += 0.05;

            return model;
        },

        updatePortraitViewport: function(player, index, isCurrentTurn) {
            var viewport = this.portraitViewports[index];
            if (!viewport) {
                return;
            }

            if (viewport.sourcePiece !== player.piece) {
                if (viewport.model) {
                    viewport.scene.remove(viewport.model);
                }
                viewport.model = this.getPortraitModelForPlayer(player, index);
                viewport.sourcePiece = player.piece;
                viewport.scene.add(viewport.model);
            }

            if (viewport.model) {
                viewport.model.rotation.y = 0;
                viewport.model.position.y = viewport.baseY;
            }

            viewport.rimLight.intensity = isCurrentTurn ? 2.1 : 1.4;
            viewport.renderer.render(viewport.scene, viewport.camera);
        },

        destroyCornerPanels: function() {
            for (var r = 0; r < this.portraitViewports.length; r++) {
                var viewport = this.portraitViewports[r];
                if (!viewport) {
                    continue;
                }

                if (viewport.model) {
                    viewport.scene.remove(viewport.model);
                    viewport.model = null;
                }

                if (viewport.renderer) {
                    viewport.renderer.dispose();
                }
            }
            this.portraitViewports = [];

            for (var i = 0; i < this.cornerPanels.length; i++) {
                var panel = this.cornerPanels[i].panel;
                if (panel && panel.parentNode) {
                    panel.parentNode.removeChild(panel);
                }
            }
            this.cornerPanels = [];
        },

        updateCornerPanels: function(gameManager) {
            for (var i = 0; i < PLAYERS.length && i < this.cornerPanels.length; i++) {
                var player = PLAYERS[i];
                var panelData = this.cornerPanels[i];
                var panel = panelData.panel;
                var playerColor = '#' + player.color.toString(16).padStart(6, '0');
                var isCurrentTurn = !gameManager.isPregame() && gameManager.currentPlayerIndex === i;
                var buffsCount = player.buffs ? player.buffs.length : 0;
                var pieceLabel = player.pieceType ? player.pieceType : 'Unselected';

                panel.className = 'player-corner ' + cornerPositions[i] + (isCurrentTurn ? ' active-turn' : '');
                panelData.header.style.color = playerColor;
                panelData.portrait.style.color = playerColor;
                panelData.name.textContent = player.name;
                panelData.characterLine.textContent = 'Character: ' + pieceLabel;
                panelData.currencyLine.textContent = 'Currency: ' + player.currency;
                panelData.buffsLine.textContent = 'Buff Slots: ' + buffsCount + ' / ' + MAX_PLAYER_BUFF_SLOTS;

                this.updatePortraitViewport(player, i, isCurrentTurn);
            }
        },
        
        update: function(gameManager) {
            var now = Date.now();
            if (now - this.lastUpdate < this.updateInterval) {
                return;
            }
            this.lastUpdate = now;
            
            var currentPlayer = gameManager.getCurrentPlayer();
            var currentSpaceName = getSpaceName(currentPlayer.currentSpace) || ('Space ' + currentPlayer.currentSpace);
            var currentSpaceType = getSpaceType(currentPlayer.currentSpace) || 'UNKNOWN';
            var html = '<div style="color: #' + currentPlayer.color.toString(16).padStart(6, '0') + ';">';
            if (gameManager.gameState === 'PRE_GAME_SELECT') {
                html += '<strong>Character Select</strong><br>';
                html += '<em>Player ' + (gameManager.selectingPlayerIndex + 1) + '</em><br>';
                if (gameManager.isNameEntryActive && gameManager.isNameEntryActive()) {
                    html += '<em>Use center-screen name panel</em><br>';
                } else {
                    html += '<em>Choose your character</em><br>';
                }
            } else if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS') {
                html += '<strong>Turn Order Roll</strong><br>';
                html += '<em>Each player rolled 1 die</em><br>';
            } else {
                html += '<strong>' + currentPlayer.name + '\'s Turn</strong><br>';
                html += 'Space: ' + currentPlayer.currentSpace + ' - ' + currentSpaceName + ' (' + currentSpaceType + ')<br>';
                html += 'Currency: ' + currentPlayer.currency + '<br>';
                html += 'Buff Slots: ' + (currentPlayer.buffs ? currentPlayer.buffs.length : 0) + ' / ' + MAX_PLAYER_BUFF_SLOTS + '<br>';
            }
            
            if (gameManager.gameState === 'TURN_START') {
                html += '<em>Press V to Roll Dice</em><br>';
            } else if (gameManager.gameState === 'ROLLING') {
                html += '<em style="color: #ffff00;">ROLLING...</em><br>';
            } else if (gameManager.gameState === 'MOVING') {
                html += '<em style="color: #ffff00;">Dice Roll: ' + gameManager.diceRoll + '</em><br>';
                html += '<em>Press V again to End Turn</em><br>';
            }
            
            html += '<br><strong>Players:</strong><br>';
            for (var i = 0; i < PLAYERS.length; i++) {
                var player = PLAYERS[i];
                var playerColor = player.color.toString(16).padStart(6, '0');
                var marker = (i === gameManager.currentPlayerIndex && !gameManager.isPregame()) ? '→ ' : '  ';
                var pieceLabel = player.pieceType ? player.pieceType : 'Unselected';
                var currencyLabel = String(player.currency);
                var buffLabel = (player.buffs ? player.buffs.length : 0) + '/' + MAX_PLAYER_BUFF_SLOTS;

                if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS') {
                    var rollValue = '-';
                    for (var r = 0; r < gameManager.pregameRolls.length; r++) {
                        if (gameManager.pregameRolls[r].playerIndex === i) {
                            rollValue = gameManager.pregameRolls[r].roll;
                            break;
                        }
                    }
                    html += marker + '<span style="color: #' + playerColor + ';">' + player.name + ' [' + pieceLabel + '] — Roll: ' + rollValue + ' | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
                } else if (gameManager.gameState === 'PRE_GAME_SELECT') {
                    var selectingMarker = (i === gameManager.selectingPlayerIndex) ? '► ' : '  ';
                    var statusLabel = '';
                    if (i === gameManager.selectingPlayerIndex && gameManager.isNameEntryActive && gameManager.isNameEntryActive()) {
                        statusLabel = ' (Naming)';
                    }
                    html += selectingMarker + '<span style="color: #' + playerColor + ';">' + player.name + statusLabel + ' [' + pieceLabel + '] | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
                } else {
                    html += marker + '<span style="color: #' + playerColor + ';">' + player.name + ' [' + pieceLabel + '] (Space ' + player.currentSpace + ') | $' + currencyLabel + ' | Buffs ' + buffLabel + '</span><br>';
                }
            }

            if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS' && gameManager.turnOrder.length > 0) {
                html += '<br><strong>Order:</strong><br>';
                for (var t = 0; t < gameManager.turnOrder.length; t++) {
                    var orderPlayerIndex = gameManager.turnOrder[t];
                    html += (t + 1) + '. ' + PLAYERS[orderPlayerIndex].name + '<br>';
                }
            }
            
            html += '<br><strong>Controls:</strong><br>';
            if (gameManager.gameState === 'PRE_GAME_SELECT') {
                if (gameManager.isNameEntryActive && gameManager.isNameEntryActive()) {
                    html += 'A/D or Left/Right: Change letter<br>';
                    html += 'W/S or Up/Down: Move cursor<br>';
                    html += 'V: Confirm name<br>';
                    html += 'Mouse Click Key/Slot: Edit name<br>';
                    html += 'Mouse Click Character: Confirm name + select<br>';
                } else {
                    html += 'Mouse: Hover + Click Character<br>';
                    html += 'A/D or Left/Right: Select character<br>';
                    html += 'V: Lock character<br>';
                }
            } else if (gameManager.gameState === 'PRE_GAME_ROLL_RESULTS') {
                html += 'V: Start Match<br>';
            } else {
                html += 'Press V to Roll Dice<br>';
                html += 'Press V again to End Turn<br>';
            }
            html += '</div>';
            
            this.infoDiv.innerHTML = html;
            this.updateCornerPanels(gameManager);
            this.updateNameEntryOverlay(gameManager);
        }
    };

    ui.init();
    
    return ui;
}
