// Global variables
let player, ball, violetBricks, yellowBricks, redBricks, cursors; // for sprite data
let gameStarted = false; // for game state tracking
let openingText, gameOverText, playerWonText; // for game messages

const config = {
    type: Phaser.AUTO, // Rendering
    parent: 'game', // Id of the element which will display the game
    width: 800,
    height: 640,
    scale: {
        mode: Phaser.Scale.RESIZE, // Game resizes to fit div
        autoCenter: Phaser.Scale.CENTER_BOTH // Center to div if necessary
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false, // Disables gravity
            debug: false,
        },
    }
};

const game = new Phaser.Game(config);

// Asset Loading
function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('ball', 'assets/images/ball_32_32.png');
    this.load.image('paddle', 'assets/images/paddle_128_32.png');
    this.load.image('brick1', 'assets/images/brick1_64_32.png');
    this.load.image('brick2', 'assets/images/brick2_64_32.png');
    this.load.image('brick3', 'assets/images/brick3_64_32.png');

    this.load.audio('levelmusic', 'assets/audio/levelmusic.ogg');
    this.load.audio('gamestart', 'assets/audio/gamestart.ogg');
    this.load.audio('gameover', 'assets/audio/gameover.ogg');
    this.load.audio('brickhit', 'assets/audio/blockhit.ogg');
    this.load.audio('paddlehit', 'assets/audio/paddlehit.ogg');
}

// Game Setup
function create() {
    this.add.image(400, 320, 'background');

    // Initialize SoundEffects
    this.levelSound = this.sound.add('levelmusic');
    this.gameStartSound = this.sound.add('gamestart');
    this.gameOverSound = this.sound.add('gameover');
    this.brickHitSound = this.sound.add('brickhit');
    this.paddleHitSound = this.sound.add('paddlehit');
    

    // Player
    player = this.physics.add.sprite(
        400, // x
        600, // y
        'paddle', // sprite image
    );

    ball = this.physics.add.sprite(
        400, 
        565,
        'ball' 
    );

    // Add Violet Bricks
    violetBricks = this.physics.add.group({
        key: 'brick1', // Image used for all sprites
        repeat: 9, // How many times to create an sprite (one plus 9 = 10 sprites)
        immovable: true,
        setXY: {
            x: 80,
            y: 140,
            stepX: 70 // Lenght of pixels between repeated sprites in the x axis
        }
    });

    // Add Yellow Bricks
    yellowBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 9,
        immovable: true,
        setXY: {
            x: 80,
            y: 90,
            stepX: 70
        }
    });

    // Add Red Bricks
    redBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 9,
        immovable: true,
        setXY: {
            x: 80,
            y: 40,
            stepX: 70
        }
    });

    // Cursor for Keyboard Input
    cursors = this.input.keyboard.createCursorKeys();

    // Collision Setup
    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);

    ball.setBounce(1,1); // ball maintains velocity on collision

    this.physics.world.checkCollision.down = false; // disables bottom collision

    // bricks collision
    this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
    this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
    this.physics.add.collider(ball, redBricks, hitBrick, null, this);

    // paddle colission
    player.setImmovable(true);
    this.physics.add.collider(ball, player, hitPlayer, null, this);

    // Game Messages
    openingText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Aperte ESPAÇO para iniciar',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '40px',
            fill: '#fff'
        }
    );

    openingText.setOrigin(0.5); // makes text x and y coordinates work like sprite coordinates

    gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Game Over!',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '40px',
            fill: '#fff'
        }
    );

    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    playerWonText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Você ganhou!',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '40px',
            fill: '#fff'
        }
    );

    playerWonText.setOrigin(0.5);
    playerWonText.setVisible(false);

}

// Game Loop
function update() {
    if (isGameOver(this.physics.world)) {
        gameOverText.setVisible(true);
        ball.disableBody(true, true); // hides ball
        this.gameStartSound.play(); // TODO: Sound is not playing, need a fix
    } else if (isWon()) {
        playerWonText.setVisible(true);
        ball.disableBody(true, true);
    } else {
        player.body.setVelocityX(0); // Player stays still until key press

        if (!gameStarted) {
            ball.setX(player.x); // Center ball to paddle if game hasn't started

            if (cursors.space.isDown) {
                this.gameStartSound.play(); // play sfx
                this.levelSound.play();
                gameStarted = true;
                ball.setVelocityY(-200);
                openingText.setVisible(false);
            }
        }

        if (cursors.left.isDown) {
            player.body.setVelocityX(-350);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(350);
        }
    }
}

// Game Functions
function isGameOver(world) {
    return ball.body.y > world.bounds.height; // Check if ball is out of bounds (vertical down)
}

function isWon() {
    return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() === 0; // Check if all sprites are inactive
}

function hitBrick(ball, brick) {
    this.brickHitSound.play(); // play sfx

    brick.disableBody(true, true); // makes brick inactive and hides it from screen

    // checks ball velocity, assigns it a random number if equals 0
    if (ball.body.velocity.x === 0) {
        randNum = Math.random();
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
            ball.body.setVelocityX(-150);
        }
    }
}

function hitPlayer(ball, player) {
    this.paddleHitSound.play({ loop: false }); // play sfx

    ball.setVelocityY(ball.body.velocity.y - 5); // increases ball velocity after it bounces

    let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
    // checks if the ball is left to the player, x-velocity is negative
    if (ball.x < player.x) {
        ball.setVelocityX(-newXVelocity);
    } else {
        ball.setVelocityX(newXVelocity);
    }
}