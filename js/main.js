
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('desert', 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tmw_desert_spacing.png');
    game.load.spritesheet('car', 'assets/dude.png', 32, 48);
    // game.load.image('car', 'assets/starstruck/dude.png');
}

var map;
var layer;

var cursors;
var sprite;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('desert');

    map.addTilesetImage('Desert', 'tiles');

    layer = map.createLayer('Ground');

    layer.resizeWorld();

    sprite = game.add.sprite(32, 32, 'car');
    // sprite.anchor.setTo(0.5, 0.5);

    sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    sprite.animations.add('turn', [4], 20, true);
    sprite.animations.add('right', [5, 6, 7, 8], 10, true);

    game.physics.enable(sprite);

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

    game.input.onDown.add(fillTiles, this);

}

function fillTiles() {

    map.fill(31, layer.getTileX(sprite.x), layer.getTileY(sprite.y), 8, 8);

}

function update() {

    game.physics.arcade.collide(sprite, layer);

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

}

function render() {
    game.debug.text('Click to fill tiles', 32, 32, 'rgb(0,0,0)');
    game.debug.text('Tile X: ' + layer.getTileX(sprite.x), 32, 48, 'rgb(0,0,0)');
    game.debug.text('Tile Y: ' + layer.getTileY(sprite.y), 32, 64, 'rgb(0,0,0)');
}
