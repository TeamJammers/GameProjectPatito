
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('desert', 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tmw_desert_spacing.png');
    game.load.image('bullet', 'assets/jam-condon.png');
    game.load.image('tumbaBullet', 'assets/bullet.png');

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
var tumbas;

var spriteText

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
var tumbaBullets;
var fireRate = 100;
var nextFire = 0;

var timeString;
var timeText;


var fiestas;

var chuta;


//time of level
 
var minutes;
var seconds;

var prevTime = 0;
function create() {

    document.addEventListener('contextmenu', event => event.preventDefault());
    game.physics.startSystem(Phaser.Physics.ARCADE);
    map = game.add.tilemap('desert');
    map.addTilesetImage('Desert', 'tiles');
    map.setCollision([ 3, 4, 5, 6 ]);
    layer = map.createLayer('Ground');
    layer.resizeWorld();

		fiestas = game.add.group();
		fiestas.enableBody = true;
	
		sprite = game.add.sprite(450, 300, 'car');
    sprite.anchor.setTo(0.5, 0.5);

    spriteText = game.add.sprite(0,0);
    spriteText.fixedToCamera = true;

    turret = game.add.sprite(0, 0,'turret');
    turret.visible = false;
    turret.anchor.setTo(0.3, 0.5);

    tumbaTurret = game.add.sprite(0, 0,'tumbaturret');
    tumbaTurret.visible = false;
    tumbaTurret.anchor.setTo(0.3, 0.5);
    // audio


    // audio
    audioCarnaval = game.add.audio('chuta');
    // sprite.anchor.setTo(0.5, 0.5);
    sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    sprite.animations.add('turn', [4], 20, true);
    sprite.animations.add('right', [5, 6, 7, 8], 10, true);

		tumbas = game.add.group();
		tumbas.enableBody = true;
		game.physics.arcade.enable(sprite);
    game.camera.follow(sprite);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(100, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);


    tumbaBullets = game.add.group();
    tumbaBullets.enableBody = true;
    tumbaBullets.physicsBodyType = Phaser.Physics.ARCADE;
    tumbaBullets.createMultiple(100, 'tumbaBullet', 0, false);
    tumbaBullets.setAll('anchor.x', 0.5);
    tumbaBullets.setAll('anchor.y', 0.5);
    tumbaBullets.setAll('outOfBoundsKill', true);
    tumbaBullets.setAll('checkWorldBounds', true);


    cursors = game.input.keyboard.createCursorKeys();

    wasd = {
          up: game.input.keyboard.addKey(Phaser.Keyboard.W),
          down: game.input.keyboard.addKey(Phaser.Keyboard.S),
          left: game.input.keyboard.addKey(Phaser.Keyboard.A),
          right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };


    var style = { fill : "#FFFFFF" };
    timeText = game.add.text(10, 10, timeString, style);

    spriteText.addChild(timeText);
   
    seconds = 0;
    minutes = 0;

    seconds = Number.parseInt(seconds);
    minutes = Number.parseInt(minutes);

    var timer = game.time.create();
    timer.repeat(1 * Phaser.Timer.SECOND, 7200, updateTime, this);
    timer.start();
    game.sound.setDecodedCallback(audioCarnaval, start, this);
}

function start() {
    audioCarnaval.play();
    audioCarnaval.loopFull(0.5);
}

function collisionHandler(bullet) {
    bullet.body.enable = false;
    // bullet.kill();
    // bullet.destroy();
    bullets.remove(bullet);
    // console.log(':O');
}
var ok = 0;
var generateAfter = 30;
function columnWasHouse(column) {
	for (let i = 0; i < 4; i++) {
		if (!((column - i )% 8)) {
			return column;
		}
	}
	return -1;
}
function collidePepino(pepino, tumba) {
	console.log(pepino, tumba);
	pepino.kill();
}
function update() {
		const time = parseInt(minutes) * 60 + parseInt(seconds);
		if (prevTime === time) { 
			prevTime = time + generateAfter;
			let row = parseInt(Math.random() * 40);
			while(row % 4) {
				row--;
			}
			let column = parseInt(Math.random() * 40);
			while(columnWasHouse(column) === -1) {
				column--;
			}
			let fiesta = game.add.sprite(row * 32, column * 32, 'fiesta');
			fiesta.animations.add('on', [0, 0], 10, true);
			fiesta.animations.play('on');
			fiestas.addChild(fiesta);
			let tumba = game.add.sprite((row - 2) * 32, column * 32, 'tumba');
			tumba.animations.add('tumbaRotate', [0, 1, 2, 3], 2, true);
			game.physics.arcade.enable(tumba);
			tumbas.addChild(tumba);
			let tumba2 = game.add.sprite((row + 2) * 32, column * 32, 'tumba');
			tumba2.animations.add('tumbaRotate', [0, 1, 2, 3], 2, true);
			game.physics.arcade.enable(tumba2);
			tumbas.addChild(tumba2);
		}
		game.physics.arcade.overlap(tumbas, sprite, collidePepino, null, this);
		tumbas.children.forEach(tumba => {
			if (game.physics.arcade.distanceBetween(tumba, sprite) > 0 && game.physics.arcade.distanceBetween(tumba, sprite) < 160) {	
				game.physics.arcade.moveToObject(tumba, sprite, 220);
			} else {
				tumba.body.velocity.set(0);
			}
			game.physics.arcade.collide(sprite, tumba, () => {
				sprite.kill();
			});
			game.physics.arcade.collide(tumba, layer);
			tumba.animations.play('tumbaRotate');
			
		});
    game.physics.arcade.collide(sprite, layer);
		game.physics.arcade.collide(bullets, layer, collisionHandler, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    // Iniciando animacion de tumba

    var currentX = layer.getTileX(sprite.x);
    var currentY = layer.getTileY(sprite.y);

    if (cursors.left.isDown || wasd.left.isDown) {
        sprite.animations.play('left');
        if(currentX == 0) {justPressed
            sprite.body.velocity.x = 0;
        } else {
            sprite.body.velocity.x -= 200;
        }
    }
    if (cursors.right.isDown || wasd.right.isDown) {
        sprite.animations.play('right');
        if(currentX == gameWidth - 1) {
            sprite.body.velocity.x = 0;
        } else {
            sprite.body.velocity.x += 200;
        }
    }

    if (cursors.up.isDown || wasd.up.isDown) {
        sprite.animations.play('up');
        if(currentY == 0) {
            sprite.body.velocity.y = 0;
        } else {
            sprite.body.velocity.y -= 200;
        }
    }
    if (cursors.down.isDown || wasd.down.isDown) {
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
    tumbaTurret.x = sprite.x;
    tumbaTurret.y = sprite.y;
    turret.rotation = game.physics.arcade.angleToPointer(tumbaTurret);

    if (game.input.activePointer.leftButton.isDown) {
        //  Boom!
        fire();
    }
    if(game.input.activePointer.rightButton.isDown){
        fireTumba();
    }

}

function render() {
    
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

function fireTumba(){

  if (game.time.now > nextFire && tumbaBullets.countDead() > 0) {
     nextFire = game.time.now + fireRate;
      var tumbaBullet = tumbaBullets.getFirstExists(false);
      tumbaBullet.reset(tumbaTurret.x, tumbaTurret.y);
      tumbaBullet.rotation = game.physics.arcade.moveToPointer(tumbaBullet, 1000, game.input.activePointer, 500);
    }
}

function bulletHitTumba (srpite, bullet) {
    tumbaBullet.kill();
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
