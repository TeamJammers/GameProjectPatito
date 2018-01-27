
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('desert', 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tmw_desert_spacing.png');
    game.load.image('car', 'assets/pepino.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    game.load.spritesheet('car', 'assets/dude.png', 32, 48);
    // game.load.image('car', 'assets/starstruck/dude.png');
    //music
    game.load.audio('chuta', 'assets/audio/chutaalegre.mp3');


}

var map;
var layer;

var cursors;
var sprite;


var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;


var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

var chuta;
function create() {

    //title
    var style = { font: "65px Arial", fill: "#52bace", align: "center" };
    text = game.add.text(game.world.centerX, 100, "Bienvenidos al Carnaval 2018", style);
    text.anchor.set(0.5);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('desert');

    map.addTilesetImage('Desert', 'tiles');

    layer = map.createLayer('Ground');

    layer.resizeWorld();

    //audio
    chuta = game.add.audio('chuta');
    sounds = [ chuta];

    sprite = game.add.sprite(32, 32, 'car');
    // sprite.anchor.setTo(0.5, 0.5);

    sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    sprite.animations.add('turn', [4], 20, true);
    sprite.animations.add('right', [5, 6, 7, 8], 10, true);

    game.physics.enable(sprite);

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

    game.input.onDown.add(fillTiles, this);
    game.sound.setDecodedCallback(sounds, start, this);

}

function start() {

    sounds.shift();

    chuta.loopFull(0.6);
    chuta.onLoop.add(hasLooped, this);

    text.text = 'Chuta';

}

function hasLooped(sound) {

    loopCount++;

    if (loopCount === 1)
    {
        sounds.shift();
        drums.loopFull(0.6);
        text.text = 'drums';
        game.add.tween(speakers.scale).to( { x: 1.3, y: 1.1 }, 230, "Sine.easeInOut", true, 0, -1, true);
    }
    else if (loopCount === 2)
    {
        current = game.rnd.pick(sounds);
        current.loopFull();
        text.text = current.key;
    }
    else if (loopCount > 2)
    {
        current.stop();
        current = game.rnd.pick(sounds);
        current.loopFull();
        text.text = current.key;
    }


    turret = game.add.sprite(0, 0, 'sprite', 'turret');
    turret.anchor.setTo(0.3, 0.5);



    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    cursors = game.input.keyboard.createCursorKeys();

}

function fillTiles() {

    map.fill(31, layer.getTileX(sprite.x), layer.getTileY(sprite.y), 8, 8);

}

function update() {

    game.physics.arcade.collide(sprite, layer);

    game.physics.arcade.overlap(enemyBullets, sprite, bulletHitPlayer, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    if (cursors.left.isDown) {
        sprite.animations.play('left');
        sprite.body.velocity.x -= 200;
    }
    if (cursors.right.isDown) {
        sprite.animations.play('right');
        sprite.body.velocity.x += 200;
    }

    if (cursors.up.isDown) {
        sprite.body.velocity.y -= 200;
        sprite.animations.play('turn');
    }
    if (cursors.down.isDown) {
        sprite.animations.play('turn');
        sprite.body.velocity.y += 200;
    }



    turret.x = sprite.x;
    turret.y = sprite.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
    }

}

function render() {
    game.debug.text('Click to fill tiles', 32, 32, 'rgb(0,0,0)');
    game.debug.text('Tile X: ' + layer.getTileX(sprite.x), 32, 48, 'rgb(0,0,0)');
    game.debug.text('Tile Y: ' + layer.getTileY(sprite.y), 32, 64, 'rgb(0,0,0)');
}



function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }

}


function bulletHitPlayer (tank, bullet) {

    bullet.kill();

}

