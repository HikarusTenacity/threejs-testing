// Settings Manager for game configuration
function createSettingsManager() {
    var STORAGE_KEY = 'politico-settings';
    
    var defaultSettings = {
        volume: 0.7,
        musicVolume: 0.6,
        sfxVolume: 0.8,
        graphicsQuality: 'high',  // 'low', 'medium', 'high'
        gameSpeed: 1.0,            // 0.5x to 2.0x
        shadowsEnabled: true,
        effectsEnabled: true
    };
    
    var manager = {
        settings: {},
        listeners: [],
        
        init: function() {
            this.loadSettings();
        },
        
        loadSettings: function() {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    this.settings = JSON.parse(stored);
                    // Merge with defaults to ensure all keys exist
                    this.settings = Object.assign({}, defaultSettings, this.settings);
                } catch (e) {
                    console.warn('Failed to parse settings, using defaults', e);
                    this.settings = Object.assign({}, defaultSettings);
                }
            } else {
                this.settings = Object.assign({}, defaultSettings);
            }
        },
        
        saveSettings: function() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
                this.notifyListeners();
            } catch (e) {
                console.error('Failed to save settings', e);
            }
        },
        
        getSetting: function(key) {
            return this.settings[key];
        },
        
        setSetting: function(key, value) {
            if (this.settings.hasOwnProperty(key)) {
                this.settings[key] = value;
                this.saveSettings();
                return true;
            }
            return false;
        },
        
        getAll: function() {
            return Object.assign({}, this.settings);
        },
        
        resetToDefaults: function() {
            this.settings = Object.assign({}, defaultSettings);
            this.saveSettings();
        },
        
        // Observer pattern for settings changes
        subscribe: function(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        },
        
        unsubscribe: function(callback) {
            this.listeners = this.listeners.filter(function(listener) {
                return listener !== callback;
            });
        },
        
        notifyListeners: function() {
            var settings = this.settings;
            this.listeners.forEach(function(callback) {
                callback(settings);
            });
        },
        
        // Helper methods for specific settings
        getVolume: function() {
            return this.settings.volume;
        },
        
        setVolume: function(value) {
            value = Math.max(0, Math.min(1, value));
            this.settings.volume = value;
            this.settings.musicVolume = value * 0.85;
            this.settings.sfxVolume = value * 1.0;
            this.saveSettings();
        },
        
        getGraphicsQuality: function() {
            return this.settings.graphicsQuality;
        },
        
        setGraphicsQuality: function(quality) {
            var validQualities = ['low', 'medium', 'high'];
            if (validQualities.indexOf(quality) !== -1) {
                this.settings.graphicsQuality = quality;
                this.saveSettings();
            }
        },
        
        getGameSpeed: function() {
            return this.settings.gameSpeed;
        },
        
        setGameSpeed: function(speed) {
            speed = Math.max(0.5, Math.min(2.0, speed));
            this.settings.gameSpeed = speed;
            this.saveSettings();
        },
        
        areShadowsEnabled: function() {
            return this.settings.shadowsEnabled;
        },
        
        setShadowsEnabled: function(enabled) {
            this.settings.shadowsEnabled = !!enabled;
            this.saveSettings();
        },
        
        areEffectsEnabled: function() {
            return this.settings.effectsEnabled;
        },
        
        setEffectsEnabled: function(enabled) {
            this.settings.effectsEnabled = !!enabled;
            this.saveSettings();
        }
    };
    
    manager.init();
    return manager;
}
