// GAME CONFIG
const config = {
    type: Phaser.AUTO, 
    parent: 'game-container', 
    width: 800,
    height: 600,
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: { preload, create, update },
    physics: { default: 'arcade', arcade: { gravity: { y: 500 }, debug: false }},
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
    // Drawing and setting the level
    map = this.make.tilemap({key: 'map'}); // Load the map
    
    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite    
    player = this.physics.add.sprite(200, 200, 'player');
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map  

    // Handling Collision
    this.physics.add.collider(groundLayer, player);

    // Settings Input Cursors
    cursors = this.input.keyboard.createCursorKeys();
};

function update() {
    // TODO: Runs once per frame, game logic
    // Input Handling
    if (cursors.left.isDown) { // Left
        player.body.setVelocityX(-200);
    } else if (cursors.right.isDown) { // Right
        player.body.setVelocity(200); 
    } else { // Idle
        player.body.setVelocityX(0);
    }
    if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor()) { // Jump
        player.body.setVelocityY(-500);
    }
    
};

// GAME FUNCTIONS