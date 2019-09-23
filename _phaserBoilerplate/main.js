// GAME CONFIG
const config = {
    type: Phaser.AUTO, 
    parent: 'game', 
    width: 800,
    height: 640,
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: { preload, create, update },
    physics: { default: 'arcade', arcade: { debug: false }},
};

const game = new Phaser.Game(config);

// MAIN STATE FUNCTIONS
function preload() {
    // TODO: Asset Loading
};

function create() {
    // TODO: Game Setup
};

function update() {
    // TODO: Game Loop
};

// GAME FUNCTIONS
// TODO: Game Handling Functions