// GAME CONFIG
const config = {
    type: Phaser.AUTO, 
    parent: 'game-container', 
    width: 800,
    height: 600,
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: { preload, create, update },
    physics: { default: 'arcade', arcade: { gravity: {y: 500}, debug: false }},
};

const game = new Phaser.Game(config);

// GAME VARIABLES
var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;

// MAIN STATE FUNCTIONS
function preload() {
    // TODO: Runs once, asset Loading
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json'); // Tiled Map Json
    this.load.spritesheet('tiles', 'assets/tilesheets/tiles.png', {frameWidth: 70, frameHeight: 70}); // Tilesheet with grid height and width
    this.load.image('coin', 'assets/images/coinGold.png'); 
    this.load.atlas('player', 'assets/images/player.png', 'assets/images/player.json'); // Player Spritesheet with Json Texture Atlas
};

function create() {
    // TODO: Runs once, game setup
    map = this.make.tilemap({key: 'map'}); // Load the map

    var groundTiles = map.addTilesetImage('tiles'); // Tiles for the ground Layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0); // Creating the ground layer
    groundLayer.setCollisionByExclusion([-1]); // Setting collision for ground layer

    // Setting gameworld boundarie
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    
};

function update() {
    // TODO: Runs once per frame, game logic
};

// GAME FUNCTIONS