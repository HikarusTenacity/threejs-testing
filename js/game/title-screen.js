function createTitleScreen() {
    var root = document.createElement('div');
    root.className = 'title-screen-overlay';

    var logo = document.createElement('h1');
    logo.className = 'title-screen-logo';
    logo.textContent = 'Skyboard Showdown';
    root.appendChild(logo);

    var subtitle = document.createElement('p');
    subtitle.className = 'title-screen-subtitle';
    subtitle.textContent = 'Pick your character, lock your name, and race across the board.';
    root.appendChild(subtitle);

    var startButton = document.createElement('button');
    startButton.className = 'title-screen-start';
    startButton.type = 'button';
    startButton.textContent = 'Press To Start';
    root.appendChild(startButton);

    var controls = document.createElement('div');
    controls.className = 'title-screen-controls';
    controls.innerHTML = 'Mouse: Select character and letters<br>Action Button: Confirm / Roll';
    root.appendChild(controls);

    document.body.appendChild(root);

    return {
        root: root,
        startButton: startButton,
        isVisible: true,

        onStart: function(callback) {
            var self = this;
            if (typeof callback !== 'function') {
                return;
            }

            var startHandler = function() {
                if (!self.isVisible) {
                    return;
                }
                callback();
            };

            this.startButton.addEventListener('click', startHandler);

            window.addEventListener('keydown', function(event) {
                if (!self.isVisible) {
                    return;
                }

                if (event.code === 'Enter' || event.code === 'Space') {
                    event.preventDefault();
                    callback();
                }
            });
        },

        hide: function() {
            if (!this.isVisible) {
                return;
            }
            this.isVisible = false;
            this.root.classList.add('hidden');
        }
    };
}