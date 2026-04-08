function createCreditsScreen() {
    var root = document.createElement('div');
    root.className = 'credits-overlay hidden';

    var panel = document.createElement('div');
    panel.className = 'credits-panel';

    var titleBar = document.createElement('div');
    titleBar.className = 'credits-title-bar';

    var title = document.createElement('h2');
    title.className = 'credits-title';
    title.textContent = 'Credits';
    titleBar.appendChild(title);

    var closeButton = document.createElement('button');
    closeButton.className = 'credits-close-btn';
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    titleBar.appendChild(closeButton);

    panel.appendChild(titleBar);

    var viewport = document.createElement('div');
    viewport.className = 'credits-scroll-viewport';

    var track = document.createElement('div');
    track.className = 'credits-scroll-track';

    var creditsLines = [
        'POLITICO!',
        '',
        'Created by',
        'Hayden Honjo, Anderson Huang, Simar Pabla, Sophia Notario, and Mackenzie Seago',
        'Engine',
        'Three.js',
        'Core Systems',
        'Hayden, Anderson, Kenzie',
        'Character Design & Art',
        'Simar and Sophia',
        '3D Models, UI',
        'Hayden',
        'Special Thanks',
        'Dr. Royaltey',
        '',
        '',
        'Thanks for playing!'
    ];

    for (var i = 0; i < creditsLines.length; i++) {
        var line = document.createElement('div');
        line.className = i % 2 === 0 ? 'credits-line credits-line-strong' : 'credits-line';
        line.textContent = creditsLines[i] || '\u00A0';
        track.appendChild(line);
    }

    viewport.appendChild(track);
    panel.appendChild(viewport);
    root.appendChild(panel);
    document.body.appendChild(root);

    var screen = {
        root: root,
        viewport: viewport,
        track: track,
        scrollTimer: null,
        isVisible: false,
        show: function() {
            this.root.classList.remove('hidden');
            this.isVisible = true;

            this.viewport.scrollTop = 0;

            var self = this;
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
            }

            this.scrollTimer = setInterval(function() {
                if (!self.isVisible) return;

                self.viewport.scrollTop += 1;
                // prevent overscrolling, loop
                if (self.viewport.scrollTop + self.viewport.clientHeight >= self.viewport.scrollHeight) {
                    self.viewport.scrollTop = 0;
                }
            }, 22);
        },
        hide: function() {
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
                this.scrollTimer = null;
            }
            this.root.classList.add('hidden');
            this.isVisible = false;
        }
    };

    closeButton.addEventListener('click', function() {
        screen.hide();
    });

    root.addEventListener('click', function(event) {
        if (event.target === root) screen.hide();
    });

    window.addEventListener('keydown', function(event) {
        if (event.code === 'Escape' && screen.isVisible) {
            event.preventDefault();
            screen.hide();
        }
    });

    return screen;
}
