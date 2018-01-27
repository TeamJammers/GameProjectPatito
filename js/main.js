
var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('level1', 'assets/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/starstruck/tiles-1.png');
    game.load.spritesheet('dude', 'assets/starstruck/dude.png', 32, 48);
    game.load.spritesheet('tumba', 'assets/starstruck/tumba.png', 32, 48);
    game.load.spritesheet('droid', 'assets/starstruck/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/starstruck/star.png');
    game.load.image('starBig', 'assets/starstruck/star2.png');
    game.load.image('background', 'assets/starstruck/background2.png');

}

var map;
var tileset;
var layer;
var player;
var enemy;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(32, 32, 'dude');
    enemy = game.add.sprite(32, 32, 'tumba');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    enemy.body.bounce.y = 0.2;
    enemy.body.collideWorldBounds = true;
    enemy.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    enemy.animations.add('left', [0, 1, 2, 3], 10, true);
    enemy.animations.add('turn', [4], 20, true);
    enemy.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);

}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(enemy, layer);

    player.body.velocity.x = 0;
    enemy.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        enemy.body.velocity.x = -100;

        if (facing != 'left')
        {
            player.animations.play('left');
            enemy.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        enemy.body.velocity.x = 100;

        if (facing != 'right')
        {
            player.animations.play('right');
            enemy.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();
            enemy.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
                enemy.frame = 0;
            }
            else
            {
                player.frame = 5;
                enemy.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        enemy.body.velocity.y = -250;
        
          jumpTimer = game.time.now + 750;
          console.log("Estoy saltabndo");
        
        
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
