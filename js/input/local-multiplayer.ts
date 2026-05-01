// Single button/mouse input handler
function createLocalMultiplayerInput() {
    var input = {
        // Callback for player actions
        onActionForPlayer: null,
        onRawKeyInput: null,
        actionButton: null,
        
        init: function() {
            var self = this;
            
            // Create the action button
            this.createActionButton();
        },
        
        createActionButton: function() {
            var self = this;
            
            // Create button element
            this.actionButton = document.createElement('button');
            this.actionButton.id = 'actionButton';
            this.actionButton.textContent = 'Click to Start';
            this.actionButton.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                padding: 20px 60px;
                font-size: 28px;
                font-weight: bold;
                font-family: var(--game-font);
                background: linear-gradient(180deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border: 4px solid #2d6b2f;
                border-radius: 12px;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 6px 0 #1e4620, 0 10px 20px rgba(0,0,0,0.4);
                text-transform: uppercase;
                letter-spacing: 2px;
                transition: all 0.1s ease;
                pointer-events: auto;
                -webkit-font-smoothing: none;
                text-rendering: optimizeSpeed;
                filter: blur(var(--lofi-text-blur-controls));
            `;
            
            // Click handler
            this.actionButton.addEventListener('click', function() {
                if (self.onActionForPlayer) {
                    self.onActionForPlayer('ANY', 'ACTION');
                }
            });
            
            // Hover effects
            this.actionButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(-50%) translateY(-2px)';
                this.style.boxShadow = '0 8px 0 #1e4620, 0 12px 25px rgba(0,0,0,0.5)';
            });
            
            this.actionButton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(-50%)';
                this.style.boxShadow = '0 6px 0 #1e4620, 0 10px 20px rgba(0,0,0,0.4)';
            });
            
            // Active state
            this.actionButton.addEventListener('mousedown', function() {
                this.style.transform = 'translateX(-50%) translateY(3px)';
                this.style.boxShadow = '0 3px 0 #1e4620, 0 5px 15px rgba(0,0,0,0.4)';
            });
            
            this.actionButton.addEventListener('mouseup', function() {
                this.style.transform = 'translateX(-50%) translateY(-2px)';
                this.style.boxShadow = '0 8px 0 #1e4620, 0 12px 25px rgba(0,0,0,0.5)';
            });
            
            document.body.appendChild(this.actionButton);
        },
        
        setButtonText: function(text) {
            if (this.actionButton) {
                this.actionButton.textContent = text;
            }
        },
        
        setButtonColor: function(color) {
            if (this.actionButton) {
                var colors = {
                    green: { bg: 'linear-gradient(180deg, #4CAF50 0%, #45a049 100%)', border: '#2d6b2f', shadow: '#1e4620' },
                    blue: { bg: 'linear-gradient(180deg, #2196F3 0%, #1976D2 100%)', border: '#0d47a1', shadow: '#0a3270' },
                    orange: { bg: 'linear-gradient(180deg, #FF9800 0%, #F57C00 100%)', border: '#E65100', shadow: '#bf360c' },
                    red: { bg: 'linear-gradient(180deg, #f44336 0%, #d32f2f 100%)', border: '#b71c1c', shadow: '#7f0000' }
                };
                var c = colors[color] || colors.green;
                this.actionButton.style.background = c.bg;
                this.actionButton.style.borderColor = c.border;
                this.actionButton.style.boxShadow = `0 6px 0 ${c.shadow}, 0 10px 20px rgba(0,0,0,0.4)`;
            }
        },
        
        update: function() {
            // Nothing to poll - using click events only
        }
    };
    
    return input;
}
