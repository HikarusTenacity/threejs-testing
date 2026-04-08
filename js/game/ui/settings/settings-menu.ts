// @ts-nocheck
// Settings Menu UI
function createSettingsMenu(settingsManager) {
    var root = document.createElement('div');
    root.className = 'settings-overlay';
    root.classList.add('hidden');

    var settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';

    var titleBar = document.createElement('div');
    titleBar.className = 'settings-title-bar';

    var title = document.createElement('h2');
    title.className = 'settings-title';
    title.textContent = 'Settings';
    titleBar.appendChild(title);

    var closeButton = document.createElement('button');
    closeButton.className = 'settings-close-btn';
    closeButton.textContent = '✕';
    closeButton.type = 'button';
    titleBar.appendChild(closeButton);

    settingsPanel.appendChild(titleBar);

    // Settings content
    var content = document.createElement('div');
    content.className = 'settings-content';

    // Volume Control
    var volumeSection = createSettingSection('Master Volume', 'volume');
    volumeSection.volumeSlider = createVolumeSlider('volume', settingsManager.getVolume() * 100);
    volumeSection.volumeValue = createValueLabel(Math.round(settingsManager.getVolume() * 100) + '%');
    volumeSection.appendChild(volumeSection.volumeSlider);
    volumeSection.appendChild(volumeSection.volumeValue);
    content.appendChild(volumeSection);

    // Graphics Quality
    var graphicsSection = createSettingSection('Graphics Quality');
    var currentQuality = settingsManager.getGraphicsQuality();
    var graphicsOptions = ['Low', 'Medium', 'High'];
    var qualityValues = ['low', 'medium', 'high'];
    graphicsSection.graphicsButtons = [];
    
    graphicsOptions.forEach(function(label, index) {
        var btn = createOptionButton(label, qualityValues[index] === currentQuality);
        btn.value = qualityValues[index];
        if (qualityValues[index] === currentQuality) {
            btn.classList.add('selected');
        }
        graphicsSection.graphicsButtons.push(btn);
        graphicsSection.appendChild(btn);
    });
    content.appendChild(graphicsSection);

    // Game Speed Control
    var gameSpeedSection = createSettingSection('Game Speed');
    gameSpeedSection.speedSlider = createGameSpeedSlider('game-speed', settingsManager.getGameSpeed());
    gameSpeedSection.speedValue = createValueLabel((settingsManager.getGameSpeed() * 100).toFixed(0) + '%');
    gameSpeedSection.appendChild(gameSpeedSection.speedSlider);
    gameSpeedSection.appendChild(gameSpeedSection.speedValue);
    content.appendChild(gameSpeedSection);

    // Retro Mode Toggle
    var retroModeSection = createSettingSection('Retro Mode');
    retroModeSection.retroModeToggle = createToggleButton('Retro Mode', settingsManager.isRetroModeEnabled());
    retroModeSection.appendChild(retroModeSection.retroModeToggle);
    content.appendChild(retroModeSection);

    settingsPanel.appendChild(content);

    // Button bar
    var buttonBar = document.createElement('div');
    buttonBar.className = 'settings-button-bar';

    var resetButton = document.createElement('button');
    resetButton.className = 'settings-button settings-reset-btn';
    resetButton.type = 'button';
    resetButton.textContent = 'Reset to Defaults';
    buttonBar.appendChild(resetButton);

    var applyButton = document.createElement('button');
    applyButton.className = 'settings-button settings-apply-btn';
    applyButton.type = 'button';
    applyButton.textContent = 'Close';
    buttonBar.appendChild(applyButton);

    settingsPanel.appendChild(buttonBar);

    root.appendChild(settingsPanel);
    document.body.appendChild(root);

    root.addEventListener('click', function(event) {
        if (event.target === root) {
            closeButton.click();
        }
    });

    return {
        root: root,
        isVisible: false,

        show: function() {
            this.root.classList.remove('hidden');
            this.isVisible = true;
        },

        hide: function() {
            this.root.classList.add('hidden');
            this.isVisible = false;
        },

        onClose: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            closeButton.addEventListener('click', callback);
            applyButton.addEventListener('click', callback);
            
            // Also close on ESC key
            var self = this;
            var escHandler = function(event) {
                if (event.code === 'Escape' && self.isVisible) {
                    event.preventDefault();
                    callback();
                }
            };
            window.addEventListener('keydown', escHandler);
        },

        onReset: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            resetButton.addEventListener('click', function() {
                if (confirm('Reset all settings to defaults?')) {
                    callback();
                    // Update UI after reset
                    volumeSection.volumeSlider.value = settingsManager.getVolume() * 100;
                    volumeSection.volumeValue.textContent = Math.round(settingsManager.getVolume() * 100) + '%';
                    
                    gameSpeedSection.speedSlider.value = settingsManager.getGameSpeed();
                    gameSpeedSection.speedValue.textContent = (settingsManager.getGameSpeed() * 100).toFixed(0) + '%';
                    
                    var newQuality = settingsManager.getGraphicsQuality();
                    graphicsSection.graphicsButtons.forEach(function(btn) {
                        btn.classList.remove('selected');
                        if (btn.value === newQuality) {
                            btn.classList.add('selected');
                        }
                    });
                    
                    retroModeSection.retroModeToggle.updateToggle(settingsManager.isRetroModeEnabled());
                }
            });
        },

        onVolumeChange: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            volumeSection.volumeSlider.addEventListener('input', function(e) {
                var value = parseFloat(e.target.value) / 100;
                volumeSection.volumeValue.textContent = e.target.value + '%';
                callback(value);
            });
        },

        onGraphicsChange: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            graphicsSection.graphicsButtons.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    graphicsSection.graphicsButtons.forEach(function(b) {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                    callback(btn.value);
                });
            });
        },

        onGameSpeedChange: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            gameSpeedSection.speedSlider.addEventListener('input', function(e) {
                var value = parseFloat(e.target.value);
                gameSpeedSection.speedValue.textContent = (value * 100).toFixed(0) + '%';
                callback(value);
            });
        },

        onRetroModeToggle: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }
            retroModeSection.retroModeToggle.addEventListener('change', function(e) {
                callback(e.target.checked);
            });
        }
    };
}

// Helper function to create a settings section
function createSettingSection(labelText, dataValue) {
    var section = document.createElement('div');
    section.className = 'settings-section';
    if (dataValue) {
        section.dataset.setting = dataValue;
    }

    var label = document.createElement('label');
    label.className = 'settings-label';
    label.textContent = labelText;
    section.appendChild(label);

    var controlsDiv = document.createElement('div');
    controlsDiv.className = 'settings-controls';
    section.appendChild(controlsDiv);

    // Override appendChild to add to controlsDiv instead
    var originalAppend = section.appendChild;
    section.appendChild = function(element) {
        if (element === controlsDiv || element === label) {
            originalAppend.call(this, element);
        } else {
            controlsDiv.appendChild(element);
        }
    };

    return section;
}

// Helper function to create volume slider
function createVolumeSlider(id, initialValue) {
    var container = document.createElement('div');
    container.className = 'slider-container';

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.className = 'settings-slider';
    slider.min = '0';
    slider.max = '100';
    slider.value = initialValue;
    slider.step = '5';

    container.appendChild(slider);
    return slider;
}

// Helper function to create game speed slider
function createGameSpeedSlider(id, initialValue) {
    var container = document.createElement('div');
    container.className = 'slider-container';

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.className = 'settings-slider';
    slider.min = '0.5';
    slider.max = '2.0';
    slider.value = initialValue;
    slider.step = '0.1';

    container.appendChild(slider);
    return slider;
}

// Helper function to create value label
function createValueLabel(text) {
    var label = document.createElement('span');
    label.className = 'settings-value-label';
    label.textContent = text;
    return label;
}

// Helper function to create option button
function createOptionButton(label, isSelected) {
    var btn = document.createElement('button');
    btn.className = 'settings-option-btn';
    btn.type = 'button';
    btn.textContent = label;
    if (isSelected) {
        btn.classList.add('selected');
    }
    return btn;
}

// Helper function to create toggle button
function createToggleButton(label, initialState) {
    var container = document.createElement('div');
    container.className = 'toggle-container';

    var toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'toggle-' + label.toLowerCase().replace(/\s+/g, '-');
    toggle.className = 'settings-toggle';
    toggle.checked = initialState;

    var label_el = document.createElement('label');
    label_el.htmlFor = toggle.id;
    label_el.className = 'toggle-label';
    label_el.textContent = label;

    container.appendChild(toggle);
    container.appendChild(label_el);

    // Add method to update toggle state
    container.updateToggle = function(state) {
        toggle.checked = state;
    };

    // Make container act as event target for change events
    container.addEventListener = function(event, handler) {
        if (event === 'change') {
            toggle.addEventListener(event, handler);
        } else {
            HTMLElement.prototype.addEventListener.call(this, event, handler);
        }
    };

    return container;
}
