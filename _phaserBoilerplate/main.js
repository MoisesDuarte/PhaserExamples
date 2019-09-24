// GAME CONFIG
const config = {
    type: Phaser.AUTO, 
    width: 800,
    height: 600,
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update,
    },
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 500 }, 
            debug: false 
        }
    },
};

const game = new Phaser.Game(config);

// MAIN STATE FUNCTIONS
function preload() {
    // TODO: Runs once, asset Loading
};

function create() {
    // TODO: Runs once, game setup
};

function update() {
    // TODO: Runs once per frame, game logic
};

// GAME FUNCTIONS