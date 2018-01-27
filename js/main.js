
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('desert', 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tmw_desert_spacing.png');
    game.load.image('car', 'assets/pepino.png');
    game.load.image('bullet', 'assets/jam-condon.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    game.load.spritesheet('car', 'assets/dude.png', 32, 48);
    game.load.audio('chuta', 'assets/audio/chutaalegre.mp3');
    game.load.spritesheet('tumba', 'assets/tumba.png', 31, 48);
    game.load.spritesheet('fiesta', 'assets/fiesta.png', 32, 32);
}

var map;
var layer;

var cursors;
var sprite;
var tumba;

var gameHeight = 40;
var gameWidth  = 40;

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

var timeString;
var timeText;

var fiesta;

var chuta;


//time of level
 
var minutes;
var seconds;


function create() {

    //title
    var style = { font: "65px Arial", fill: "#52bace", align: "center" };
    text = game.add.text(game.world.centerX, 100, "Bienvenidos al Carnaval 2018", style);
    text.anchor.set(0.5);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('desert');

    map.addTilesetImage('Desert', 'tiles');

    map.setCollision([ 3, 4, 5, 6 ]);

    layer = map.createLayer('Ground');

    layer.resizeWorld();

    fiesta = game.add.sprite(0, 0, 'fiesta')
    fiesta.animations.add('on', [0, 1], 10, true);

    fiesta.animations.play('on');

    sprite = game.add.sprite(450, 300, 'car');
    sprite.anchor.setTo(0.5, 0.5);

    turret = game.add.sprite(0, 0,'turret');
    turret.visible = false;

    turret.anchor.setTo(0.3, 0.5);
    //audio
    chuta = game.add.audio('chuta');
    // sprite.anchor.setTo(0.5, 0.5);
    sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    sprite.animations.add('turn', [4], 20, true);
    sprite.animations.add('right', [5, 6, 7, 8], 10, true);

    tumba = game.add.sprite(200, 360, 'tumba');
    tumba.animations.add('tumbaRotate', [0, 1, 2, 3], 2, true);
		game.physics.enable(tumba);
    game.physics.enable(sprite);
    game.camera.follow(sprite);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(100, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    cursors = game.input.keyboard.createCursorKeys();


    var style = { fill : "#FFFFFF" };
    timeText = game.add.text(200, 200, timeString, style);

    seconds = 0;
    minutes = 0;

    seconds = Number.parseInt(seconds);
    minutes = Number.parseInt(minutes);

    var timer = game.time.create();
    timer.repeat(1 * Phaser.Timer.SECOND, 7200, updateTime, this);
    timer.start();
    game.sound.setDecodedCallback(chuta, start, this);
}

function start() {
    chuta.play();
    chuta.loopFull(0.5);
}

function collisionHandler(bullet) {
    bullet.body.enable = false;
    // bullet.kill();
    // bullet.destroy();
    bullets.remove(bullet);
    // console.log(':O');
}

function update() {
		if (game.physics.arcade.distanceBetween(tumba, sprite) > 0 && game.physics.arcade.distanceBetween(tumba, sprite) < 160) {
			game.physics.arcade.moveToObject(tumba, sprite, 220);
		} else {
			tumba.body.velocity.set(0);
		}
		game.physics.arcade.collide(sprite, tumba, () => {
			sprite.kill();
		});
    game.physics.arcade.collide(sprite, layer);
		game.physics.arcade.collide(tumba, layer);
		game.physics.arcade.collide(bullets, layer, collisionHandler, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    // Iniciando animacion de tumba
    tumba.animations.play('tumbaRotate');


    var currentX = layer.getTileX(sprite.x);
    var currentY = layer.getTileY(sprite.y);

    if (cursors.left.isDown) {
        sprite.animations.play('left');
        if(currentX == 0) {
            sprite.body.velocity.x = 0;
        } else {
            sprite.body.velocity.x -= 200;
        }
    }
    if (cursors.right.isDown) {
        sprite.animations.play('right');
        if(currentX == gameWidth - 1) {
            sprite.body.velocity.x = 0;
        } else {
            sprite.body.velocity.x += 200;
        }
    }

    if (cursors.up.isDown) {
        sprite.animations.play('up');
        if(currentY == 0) {
            sprite.body.velocity.y = 0;
        } else {
            sprite.body.velocity.y -= 200;
        }
    }
    if (cursors.down.isDown) {
        sprite.animations.play('down');
        if(currentY == gameHeight - 1) {
            sprite.body.velocity.y = 0;
        } else {
            sprite.body.velocity.y += 200;
        }
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
    // game.debug.text('Click to fill tiles', 32, 32, 'rgb(0,0,0)');
    // game.debug.text('Tile X: ' + layer.getTileX(sprite.x), 32, 48, 'rgb(0,0,0)');
    // game.debug.text('Tile Y: ' + layer.getTileY(sprite.y), 32, 64, 'rgb(0,0,0)');
}

// Funcion disparar condon
function fire () {
    if (game.time.now > nextFire && bullets.countDead() > 0) {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstExists(false);
        bullet.reset(turret.x, turret.y);
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }
}


function bulletHitPlayer (tank, bullet) {
    bullet.kill();
}


function updateTime() {
    seconds = Number.parseInt(seconds);
    minutes = Number.parseInt(minutes);
    if( seconds == 60){
        seconds = 0;
        minutes +=1; 
    }
    seconds += 1;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    timeString =  minutes + ":" + seconds;
    timeText.text = timeString;
}
