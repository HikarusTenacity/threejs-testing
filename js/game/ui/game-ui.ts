function createGameUI(infoDiv) {
    var ui = {
        infoDiv: infoDiv,
        activeGameManager: null,
        init: function() {
            playerCornerPanels.createCornerPanels();
            nameEntryOverlay.create();
            gameInfoDisplay.init(infoDiv);
        },
        update: function(gameManager) {
            this.activeGameManager = gameManager;
            gameInfoDisplay.update(gameManager);
            playerCornerPanels.updateCornerPanels(gameManager);
            nameEntryOverlay.update(gameManager);
        }
    };
    ui.init();
    return ui;
}
