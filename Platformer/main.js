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
    physics: { default: 'arcade', arcade: { gravity: { y: 500 }, debug: false }},
};

const game = new Phaser.Game(config);

// GAME VARIABLES
var map;
var player;
var cursors;
var groundLayer, coinLayer;
var score = 0;
var scoreText;

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
    
    // Setting tilesheet, map layers and collision
    var groundTiles = map.addTilesetImage('tiles');
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);

    var coinTiles = map.addTilesetImage('coin');
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // Setting gameworld boundaries
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // Setting the Player Sprite  
    player = this.physics.add.sprite(200, 200, 'player');
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map  

    player.body.setSize(player.width, player.height-8); // corrects player feet not touching ground

    // Handling Collision
    this.physics.add.collider(groundLayer, player);
    coinLayer.setTileIndexCallback(17, collectCoin, this); // coin tile index id is 17, call collectCoins function
    this.physics.add.overlap(player, coinLayer);

    // Settings Input Cursors
    cursors = this.input.keyboard.createCursorKeys();

    // Camera Settings
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Camera inside map bounds
    this.cameras.main.startFollow(player); // Camera follows player
    this.cameras.main.setBackgroundColor('#ccccff'); // Background color settings

    // Setting Player Animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10
    });

    // Setting Score Counter
    scoreText = this.add.text(20, 570, '0', {
        fontSize: '24px',
        fontStyle: 'bold',
        fill: '#ffffff'
    });
    scoreText.setScrollFactor(0); // fix text to screen, so it doesn't scroll with camera

};

function update() {
    // TODO: Runs once per frame, game logic
    // Input and Animation Handling
    if (cursors.left.isDown) { 
        player.body.setVelocityX(-200);
        player.anims.play('walk', true);
        player.flipX = true; // flips sprite facing left
    } else if (cursors.right.isDown) { 
        player.body.setVelocityX(200); 
        player.anims.play('walk', true);
        player.flipX = false; // sprite facing right
    } else { 
        player.body.setVelocityX(0); // stop movement
        player.anims.play('idle', true);
    }
    if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor()) { 
        player.body.setVelocityY(-500); // jump
    }
    
};

// GAME FUNCTIONS
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // removes the coin from the map
    score++; // increment score
    scoreText.setText(score); // updates score counter
    return false;
}