


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        key: 'gameScene',
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, 
            debug: false 
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    fps: {
        target: 45,
        forceSetTimeOut: true 

    }
};

const game = new Phaser.Game(config);

let pacman;
let lives = 0;
let cursors;
let firstPress = true;
let walls;
let score = 0;
let dots;
let gameWon = false;
let scoreText;
let powerMode = false;
let tarX;
let readPlayerInput = true;
let tarY;
let fleeStatus;
let ghostGroup;
let startGameSound;
let dieSound;
let timeoutCall = null;
let timeoutCall2 = null;
let maze = [
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 1, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 1],
    [2, 2, 1, 2, 6, 2, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 2, 6, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 5, 5, 5, 5, 5, 1, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 5, 5, 5, 1, 1, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 5, 1, 1, 5, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 5, 5, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 5, 5, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 7, 2, 2, 2, 2, 2, 1, 1, 1, 5, 5, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 7, 2, 2, 2, 2, 1, 1, 2, 1, 1, 5, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 7, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 0, 2, 1],
    [1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 1, 1, 1],
    [3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 4],
    [3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 4],
    [3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 4],
    [1, 1, 1, 2, 0, 2, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 2, 0, 2, 1, 1, 1],
    [2, 2, 1, 2, 0, 2, 2, 2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 2, 1],
    [2, 2, 1, 2, 2, 2, 2, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 2, 2, 2, 2, 1],
    [2, 2, 1, 1, 1, 1, 2, 0, 2, 1, 2, 0, 0, 0, 2, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 1, 2, 0, 0, 0, 2, 1, 2, 0, 2, 1, 1, 1, 1],
    [2, 2, 1, 2, 2, 2, 2, 0, 2, 2, 2, 0, 0, 0, 2, 1, 2, 0, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 0, 2, 1, 2, 0, 0, 0, 2, 2, 2, 0, 2, 2, 2, 2, 1],
    [2, 2, 1, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 2, 1],
    [2, 2, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 0, 2, 1, 1, 2, 0, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 1],
    [2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const numRows = maze.length; 
const numColumns = maze[0].length; 

console.log(`Number of rows: ${numRows}`);
console.log(`Number of columns: ${numColumns}`);
// Calculate the offset to center the maze
let offsetX = (config.width - maze[0].length * 16) / 2;
let offsetY = 32

console.log('OFFSETX = ', offsetX)
console.log('offsety = ', offsetY)

function createWall(x, y, width, height, color) {
    const wall = this.add.rectangle(x, y, width, height, color);
    this.physics.add.existing(wall, true);
}

function preload() {
    // Load assets (sprites, images, etc.)
    this.load.image('powerpellet', 'Assets/Sprites/powerPellet.png');
    this.load.image('dot', 'Assets/Sprites/dot.png');
    this.load.image('meg', 'Assets/Sprites/meg.png');
    this.load.spritesheet('ghost', 'Assets/Sprites/ghost_spritesheet.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
    this.load.spritesheet('ghost1', 'Assets/Sprites/meg.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('pacman', 'Assets/Sprites/pacman_spritesheet.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('blueGhost', 'Assets/Sprites/blueGhost_spritesheet.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.image('megrun', 'Assets/Sprites/megrun.png');
    this.load.image('ghostBlue', 'Assets/Sprites/ghostBlue.png');
    this.load.audio('startSound', 'Assets/Sounds/StartSound.mp3');
    this.load.audio('dieSound', 'Assets/Sounds/dieSound.mp3');
    this.load.audio('eatDot','Assets/Sounds/eatDot.mp3');
    this.load.audio('eatGhost','Assets/Sounds/eatGhost.mp3');
    this.load.audio('powerUp', 'Assets/Sounds/powerUp.mp3');
}

function create() {
    
    const cellSize = 16;
    var wallColor = 0x0000FF;  
    this.timer = 0;
    this.recalibrationInterval = 2; 

    livesGroup = this.add.group({
        key: 'pacman',
        repeat: lives - 2, 
        setXY: { x: 112, y: 16, stepX: -32 }
    });

    ghostGroup = this.physics.add.group();



    walls = this.physics.add.staticGroup();
    dots = this.physics.add.staticGroup();
    pellets = this.physics.add.staticGroup();

    this.recalibrationInterval = 30;
    //disdot = true;
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * cellSize + offsetX + cellSize / 2; // Adjusted for center
            const y = row * cellSize + offsetY + cellSize / 2; // Adjusted for center
            num = maze[row][col];
            if (num === 1) {
                const wall = this.add.rectangle(x, y, cellSize, cellSize, wallColor);
                this.add.rectangle(x, y, cellSize -2 , cellSize -2, 0x000000);
                this.physics.add.existing(wall, true);
                walls.add(wall);
            }
            else if (num === 0) {
                const dot = this.add.image(x, y, 'dot');
                dots.add(dot);
                disdot = false;
            }
            else if (num === 6) {
                const pellet = this.add.image(x, y, 'powerpellet');
                pellets.add(pellet);
            }
            else if (num == 7) {
                this.add.rectangle(x, y, 6, cellSize, 0xfefefe);
            }
            else {
                continue;

            }
        }
    }
    // Create game entities (pacman, ghosts, etc.)

    pacman = this.physics.add.sprite(432, 544, 'pacman');
    pacman.setOrigin(0.5, 0.5);
    
    ghostGroup = this.physics.add.group({
        key: 'ghost',
        repeat: 3,  
        setXY: { x: 470, y: 275}  
    });
    ghostGroup.children.iterate(function (ghost) {
        ghost.setData('direction', 'down');
        ghost.setData('givePoints', 'true');
        ghost.setOrigin(0.5, 0.5);
    });
    this.physics.add.collider(ghostGroup, walls);

    startGameSound = this.sound.add('startSound');
    dieSound = this.sound.add('dieSound');
    eatDotSound = this.sound.add('eatDot');
    eatGhostSound = this.sound.add('eatGhost');
    powerUpSound = this.sound.add('powerUp', { loop: true });
    
    var style = { fontSize: '22px', fill: '#fff', fontFamily: 'PressStart2P' };
    scoreText = this.add.text(280, 12, 'SCORE 0', style);
    scoreText.visible = false;
    startText = this.add.text(170 , 10, 'PRESS ANY KEY TO START (Arrow keys to change direction)');
    gameOverText = this.add.text(40, 10, 'GAME OVER REFRESH TO TRY AGAIN', { fontSize: '24px', fill: '#fe0000', fontFamily: 'PressStart2P' });
    gameOverText.visible = false;
    winText = this.add.text(85, 345, 'YOU WIN! YOUR SCORE WAS ' + score, { fontSize: '24px', fill: '#fe0000', fontFamily: 'PressStart2P' });
    winText.visible = false;

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(pacman, walls);
    this.physics.add.overlap(pacman, dots, eatDot, null, this);
    this.physics.add.overlap(pacman, ghostGroup, handleCollision, null, this);
    this.physics.add.overlap(pacman, pellets, powerUp, null, this);
    dieSound = this.sound.add('dieSound');
    dieSound.setVolume(0.3);
    startGameSound.setVolume(0.05);
    eatDotSound.setVolume(0.02);
    eatGhostSound.setVolume(0.2);
    powerUpSound.setVolume(0.1);
    this.physics.pause();
    this.input.keyboard.on('keydown', function (event) {
        // Check if any key is pressed
        if (firstPress) {
            startText.visible = false;
            startGameSound.play();
            firstPress = false;
            // Add a delayed call to unpause physics after the sound completes
            this.time.delayedCall(startGameSound.duration * 1000, function () {
                this.physics.resume();
            }, [], this);
        }
    }, this);

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('pacman', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('pacman', { start: 6, end: 8 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('pacman', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'rightGhost',
        frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 1 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'upGhost',
        frames: this.anims.generateFrameNumbers('ghost', { start: 6, end: 7 }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'leftGhost',
        frames: this.anims.generateFrameNumbers('ghost', { start: 2, end: 3 }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'downGhost',
        frames: this.anims.generateFrameNumbers('ghost', { start: 4, end: 5 }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'blueGhost',
        frames: this.anims.generateFrameNumbers('blueGhost', { start: 0, end: 1 }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('pacman', { start: 12, end: 19}),
        frameRate: 5,
        repeat: 0
    });
}


function update() {
    if (gameWon) {
        return;
    }
    const speed = 120
    // game logic (movement, collisions, etc.)
    if (readPlayerInput == true) {
        if (cursors.left.isDown && canMoveInDirection('left', pacman)) {
            pacman.setVelocityX(-speed);
            pacman.setVelocityY(0);
            pacman.anims.play('left', true);
        } else if (cursors.right.isDown && canMoveInDirection('right', pacman)) {
            pacman.setVelocityX(speed);
            pacman.setVelocityY(0);
            pacman.anims.play('right', true);
        } else if (cursors.up.isDown && canMoveInDirection('up', pacman)) {
            pacman.setVelocityY(-speed);
            pacman.setVelocityX(0);
            pacman.anims.play('up', true);
        } else if (cursors.down.isDown && canMoveInDirection('down', pacman)) {
            pacman.setVelocityY(speed);
            pacman.setVelocityX(0);
            pacman.anims.play('down', true);
        } 
        if (pacman.x < 40) {
            pacman.x = 750
        }
        else if(pacman.x > 760) {
            pacman.x = 40
        }
    }

    


    ghostGroup.children.iterate(function (ghost) {
        var currghost = ghost;
        var ghostSpeed = 130;
        if (currghost.x < 40) {
            currghost.x = 750
        }
        else if(currghost.x > 760) {
            currghost.x = 40
        }
        if (powerMode) {
            currghost.anims.play('blueGhost', true);
            ghostSpeed = 80;
        }
        if (!canMoveInDirection(currghost.getData('direction'), currghost) || Math.random() < 0.02) {
            direction = getRandomDirection(currghost, currghost.getData('direction'));
            switch (direction) {
                case 'up': // Move up
                    currghost.setVelocity(0, -ghostSpeed);
                    currghost.setData('direction', 'up');
                    if (!powerMode) {
                        currghost.anims.play('upGhost', true);
                    }
                    break;
                case 'down': // Move down
                    currghost.setVelocity(0, ghostSpeed);
                    currghost.setData('direction', 'down');
                    if (!powerMode) {
                        currghost.anims.play('downGhost', true);
                    }
                    break;
                case 'left': // Move left
                    currghost.setVelocity(-ghostSpeed, 0);
                    currghost.setData('direction', 'left');
                    if (!powerMode) {
                        currghost.anims.play('leftGhost', true);
                    }
                    break;
                case 'right': // Move right
                    currghost.setVelocity(ghostSpeed, 0);
                    currghost.setData('direction', 'right');
                    if (!powerMode) {
                        currghost.anims.play('rightGhost', true);
                    }
                    break;
            }
        }
    });
    
}

const pacmanSize = 16;
function canMoveInDirection(direction, sprite) {
    if (direction === 'left') {
        nextX = sprite.x - pacmanSize;
        nextY = sprite.y;
        if (!checkBlocked(nextX , nextY) && !checkBlocked(nextX, nextY - 15) && !checkBlocked(nextX, nextY + 15)) {
            return true;
        }
      } else if (direction === 'right') {
        nextX = sprite.x + 1.5 * pacmanSize;
        nextY = sprite.y;
        if (!checkBlocked(nextX , nextY) && !checkBlocked(nextX, nextY - 15) && !checkBlocked(nextX, nextY + 15)) {
            return true;
        }
      } else if (direction === 'up') {
        nextX = sprite.x;
        nextY = sprite.y - pacmanSize;
        if (!checkBlocked(nextX , nextY) && !checkBlocked(nextX - 15, nextY) && !checkBlocked(nextX + 15, nextY)) {
            return true;
        }
        return false;
      } else if (direction === 'down') {
        nextX = sprite.x;
        nextY = sprite.y + 1.5 * pacmanSize;
        if (!checkBlocked(nextX , nextY) && !checkBlocked(nextX - 15, nextY) && !checkBlocked(nextX + 15, nextY)) {
            return true;
        }
      }
    return false;

}
function checkBlocked(nextX , nextY) {  
    if (isNaN(nextX) || isNaN(nextY)) {
        // Handle the case where nextX or nextY is not a number
        return false; 
    }  
    nextX = nextX - offsetX - 1;
    nextY = nextY - offsetY - 1;
    if (nextX == 0) {
        nextX = 1;
    }
    if (nextY == 0) {
        nextY = 1;
    } 
    const nextIndexX = Math.floor(nextX / 16);
    const nextIndexY = Math.floor(nextY / 16);
    result = maze[nextIndexY][nextIndexX];
    if (result == 1 || result == 5) {
        return true;
    } else {
        return false;
    }
}

eatDot = (pacman, dot) => {
    increaseScore(10);
    if (!eatDotSound.isPlaying) {
    eatDotSound.play();
    }
    dot.destroy(); // Remove the dot from the scene
    if (dots.getLength() == 0) {
        winGame();
    }
};

function moveTowardsTarget(currX, currY, tarX, tarY, ghost1) {
    var left = Number.MAX_SAFE_INTEGER;
    var right = Number.MAX_SAFE_INTEGER;
    var down = Number.MAX_SAFE_INTEGER;
    var up = Number.MAX_SAFE_INTEGER;
    if (canMoveInDirection('left', ghost1)) {
        left = getDistToTarget(currX - 16, currY, tarX, tarY);
    } 
    if (canMoveInDirection('right', ghost1)) {
        right = getDistToTarget(currX + 16, currY, tarX, tarY);
    }
    if (canMoveInDirection('up', ghost1)) {
        up = getDistToTarget(currX, currY - 16, tarX, tarY);
    }
    if (canMoveInDirection('down', ghost1)) {
        down = getDistToTarget(currX, currY + 16, tarX, tarY);
    }
    const min = Math.min(left, right, up, down);
    if (min == left) {
        return 'left';
    } else if (min == right) {
        return 'right';
    } else if (min == up) {
        return 'up';
    } else {
        return 'down';
    }
}


function getDistToTarget(x, y, x2, y2) {
    const dist = Math.abs((x2 - x) + (y2 - y));
    return dist;
}


function getOppositeDirection(direction) {
    if (direction == 'left') {
        return 'right';
    }
    if (direction == 'right') {
        return 'left';
    }
    if (direction == 'up') {
        return 'down';
    }
    if (direction == 'down') {
        return 'up'
    }
}



function getRandomDirection(ghost, direction) {
    const randomNum = Math.random();

    if (randomNum < 0.2) {
        if (getOppositeDirection(direction) == 'left') {
            return getRandomDirection(direction)
        }
        return 'left';
    } else if (randomNum < 0.4) {
        if (getOppositeDirection(direction) == 'right') {
            return getRandomDirection(direction)
        }
        return 'right';
    } else if (randomNum < 0.6) {
        if (getOppositeDirection(direction) == 'up') {
            return getRandomDirection(direction)
        }
        return 'up';
    } else if (randomNum < 0.8){
        if (getOppositeDirection(direction) == 'down') {
            return getRandomDirection(direction)
        }
        return 'down';
    } else {
        return moveTowardsTarget(ghost.x, ghost.y, pacman.x, pacman.y, ghost);
    }
}

function handleCollision(pacman, ghost) {
    if (ghost.getData('givePoints') == 'false') {
        return;
    }
    if (!powerMode) {
        pacman.setVelocity(0);
        readPlayerInput = false;
        pacman.anims.play('die', true);
        this.physics.pause();
        dieSound.play();
        var pacmanLife = livesGroup.getFirstAlive();
        if (pacmanLife) {
            setTimeout(function() {
                pacman.x = 432
                pacman.y = 544
                pacman.anims.play('left');
                readPlayerInput = true;
                ghostGroup.children.iterate(function (ghost) {
                    ghost.x = 200;
                    ghost.y = 272;
                });
                startGameSound.play();
                if (pacmanLife) {
                    pacmanLife.destroy();
                }
                setTimeout(function() {
                    this.physics.resume();
                }.bind(this), 4510); 
            }.bind(this), 3000);
        }
        else {
            scoreText.visible = false;
            gameOverText.visible = true;
        }
    }
    else {
        eatGhostSound.play();
        increaseScore(200);
        ghost.setData('givePoints', 'false');
        ghost.setActive(false).setVisible(false);
        pointText = this.add.text(ghost.x, ghost.y, '200');
        setTimeout(removeText,1000, pointText);
        setTimeout(reviveGhost, 4200, ghost);
    }
}


function powerUp(pacman, pellet) {
    increaseScore(50);
    pellet.destroy();
    if(!powerUpSound.isPlaying) {
        powerUpSound.play();
    }
    // Clear existing timeouts
    clearTimeout(timeoutCall);
    clearTimeout(timeoutCall2);

    powerMode = true;
    changeGhostTexture('flee');

    // Set a new timeout for changing the ghost texture back to normal
    timeoutCall = setTimeout(changeGhostTexture, 6500, 'normal');

    // Set a new timeout for turning off the power mode
    timeoutCall2 = setTimeout(function() {
        powerMode = false;
        console.log('power mode off');
        powerUpSound.stop();
    }, 6500);
}

function changeGhostTexture(which) {
    console.log(which)
    if (which == 'normal') {
        ghostGroup.children.iterate(function (ghost) {
            ghost.setTexture('ghost');
        }); 
    }
    else if(which == 'flee') {
        ghostGroup.children.iterate(function (ghost) {
            ghost.setTexture('ghostBlue');
        });
    }
}

function increaseScore(points) {
    if (scoreText.visible == false) {
        scoreText.visible = true;
    }
    score += points;
    // Update the displayed score
    scoreText.setText('SCORE ' + score);
}

function reviveGhost(ghost) {
    console.log('making ghost')
    ghost.x = 470;
    ghost.y = 278;
    ghost.setData('givePoints', 'true');
    ghost.setActive(true).setVisible(true);
}

function removeText (text) {
    text.destroy();
}

winGame = () =>  {
    readPlayerInput = false;
    winText.setText('YOU WIN! YOUR SCORE WAS ' + score);
    winText.visible = true;
    if (pacman) {
        pacman.destroy();
    }
    
    while(ghostGroup.getLength() !== 0) {
        curr = ghostGroup.getFirstAlive()
        curr.destroy();
    }
    scoreText.visible = false;
    this.scene.pause();
    gameWon = true;
}