var level1 = {
preload: function() {
    game.load.tilemap('desert', 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tmw_desert_spacing.png');
    game.load.image('bullet', 'assets/jam-condon.png');
    game.load.image('tumbaBullet', 'assets/cuetillo.png');

    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    game.load.spritesheet('car', 'assets/dude.png', 32, 48);
    game.load.audio('chuta', 'assets/audio/chutaalegre.mp3');
    game.load.spritesheet('tumba', 'assets/tumba.png', 31, 48);
	game.load.spritesheet('fiesta', 'assets/fiesta.png', 32, 32);
		
	game.load.spritesheet('drugstore', 'assets/red-cross.png');
	game.load.spritesheet('store', 'assets/tienda-cuetillo.png');

	game.load.spritesheet('chola', 'assets/chola.png', 32, 32);
    game.load.spritesheet('chuta-paceno', 'assets/chuta.png', 32, 32);

},

 map: null,
 layer: null,	
 score : 0,

 cursors: null,
 sprite: null,
 tumbas: null,

 spriteText: null,

 gameHeight : 40,
 gameWidth  : 40,

 enemies: null,
 enemyBullets: null,
 enemiesTotal : 0,
 enemiesAlive : 0,
 explosions: null,

 currentSpeed : 0,
 cursors: null,

 bullets: null,
 tumbaBullets: null,
 fireRate : 100,
 nextFire : 0,

 timeString: null,
 condonString : null,
 cuetilloString  : null,
 timeText: null,


 fiestas: null,

 chutas: null,
 cholas:null ,

 chuta: null,
 chola: null,
 drugstores: null,
 stores: null,


//time of level
 
 minutes: null,
 seconds: null,

 prevTime : 0,
 currentParties : 0,

 drugstoreSet : new Set(),
 storeSet : new Set(),
 condonCount : 5,
 cohetilloCount : 5, // #spanglish :V
create: function() {
    document.addEventListener('contextmenu', event => event.preventDefault());
    game.physics.startSystem(Phaser.Physics.ARCADE);
    map = game.add.tilemap('desert');
    map.addTilesetImage('Desert', 'tiles');
    map.setCollision([ 3, 4, 5, 6 ]);
    layer = map.createLayer('Ground');
    layer.resizeWorld();

		this.fiestas = game.add.group();
		this.fiestas.enableBody = true;

		this.drugstores = game.add.group();
		this.drugstores.enableBody = true;
		for (let i = 0; i < 2; i++) {
			let row = parseInt(Math.random() * 40);
			while(row % 4) {
				row--;
			}
			let column = parseInt(Math.random() * 40);
			while(this.columnWasHouse(column) === -1) {
				column--;
			}
			this.drugstoreSet.add(row + '-' + column);
			let drugstore = game.add.sprite(row * 32, column * 32, 'drugstore');
			drugstore.animations.add('on', [0, 0], 10, true);
			game.physics.arcade.enable(drugstore);
			drugstore['hasCondon'] = true;
			drugstore.body.velocity.set(0);
			this.drugstores.addChild(drugstore);
		}
		stores = game.add.group();
		stores.enableBody = true;
		let lim = 2;
		for (let i = 0; i < lim; i++) {
			let row = parseInt(Math.random() * 40);
			while(row % 4) {
				row--;
			}
			let column = parseInt(Math.random() * 40);
			while(this.columnWasHouse(column) === -1) {
				column--;
			}
			if (this.drugstoreSet.has(row + '-' + column)) {
				lim++;
				continue;
			}
			this.storeSet.add(row + '-' + column);
			let store = game.add.sprite(row * 32, column * 32, 'store');
			store.animations.add('on', [0, 0], 10, true);
			game.physics.arcade.enable(store);
			store['hasCondon'] = true;
			store.body.velocity.set(0);
			stores.addChild(store);
		}	
		
		sprite = game.add.sprite(400, 200, 'car');
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

	this.tumbas = game.add.group();
	this.tumbas.enableBody = true;
	game.physics.arcade.enable(sprite);
    game.camera.follow(sprite);

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(this.condonCount, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);


    this.tumbaBullets = game.add.group();
    this.tumbaBullets.enableBody = true;
    this.tumbaBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.tumbaBullets.createMultiple(5, 'tumbaBullet', 0, false);
    this.tumbaBullets.setAll('anchor.x', 0.5);
    this.tumbaBullets.setAll('anchor.y', 0.5);
    this.tumbaBullets.setAll('outOfBoundsKill', true);
    this.tumbaBullets.setAll('checkWorldBounds', true);



    this.cholas = game.add.group();
    this.cholas.createMultiple(10, 'chola', 0, false);
    this.cholas.enableBody = true;
    this.cholas.physicsBodyType = Phaser.Physics.ARCADE;
    this.cholas.setAll('anchor.x', 0.5);
    this.cholas.setAll('anchor.y', 0.5);
    this.cholas.setAll('outOfBoundsKill', true);
    this.cholas.setAll('checkWorldBounds', true);
 
   	this.chutas = game.add.group();
    this.chutas.createMultiple(10, 'chuta-paceno', 0, false);
 
   // chola = game.add.sprite(368, 200, 'chola');
    // chola.animations.add('dancing', [0, 1], 5, true);
    // chola.animations.play('dancing');
    // chuta = game.add.sprite(320, 200, 'chuta-paceno');
    // chuta.animations.add('dancing', [0, 1], 5, true);
    // chuta.animations.play('dancing');


    this.cursors = game.input.keyboard.createCursorKeys();

    wasd = {
          up: game.input.keyboard.addKey(Phaser.Keyboard.W),
          down: game.input.keyboard.addKey(Phaser.Keyboard.S),
          left: game.input.keyboard.addKey(Phaser.Keyboard.A),
          right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };


    var style = { fill : "#FFFFFF" };
    this.timeText = game.add.text(10, 10, this.timeString, style);
    cuetillosText = game.add.text(200, 10, this.cuetilloString, style);
    condonesText = game.add.text(400, 10, this.condonString, style);

    spriteText.addChild(this.timeText);
    spriteText.addChild(cuetillosText);
    spriteText.addChild(condonesText);
   
    this.seconds = 0;
    this.minutes = 0;

    this.seconds = Number.parseInt(this.seconds);
    this.minutes = Number.parseInt(this.minutes);

    var timer = game.time.create();
    timer.repeat(1 * Phaser.Timer.SECOND, 7200, this.updateTime, this);
    timer.start();
    game.sound.setDecodedCallback(audioCarnaval, this.start, this);
},

 start: function() {
    audioCarnaval.play();
    audioCarnaval.loopFull(0.5);
},

collisionHandler: function(bullet) {
    bullet.body.enable = false;
    // bullet.kill();
    // bullet.destroy();
    this.bullets.remove(bullet);
    // console.log(':O');
},
collisionHandlerTumbaBullet: function(bullet, type) {
	bullet.body.enable = false;
	// bullet.kill();
	// bullet.destroy();
	this.tumbaBullets.remove(bullet);
	// console.log(':O');
},
ok : 0,
generateAfter : 30,
columnWasHouse: function(column) {
	for (let i = 0; i < 4; i++) {
		if (!((column - i )% 8)) {
			return column;
		collide}
	}
	return -1;
},
condonToFiestas: function(fiesta, condon) {
	this.score += fiesta['score'];
	this.currentParties--;
	fiesta.kill();
},
condonToTumba: function(tumba, condon) {
	condon.kill();
},
bulletToTumba: function(tumba, bullet) {
	tumba.kill();
	bullet.kill();
},
lastime : 0,
update: function() {
		const time = parseInt(this.minutes) * 60 + parseInt(this.seconds);

		if (this.time > this.lastTime) {
 			this.lastTime = this.time;


 			lastTime = time;
             this.cholas.children.forEach(function(chola) {
                 chola['tiempo']--;
                 if(chola['tiempo'] == 0) {
                     cholas.remove(chola);
                 }
             });
             this.chutas.children.forEach(function(chuta) {
                 chuta['tiempo']--;
                 if(chuta['tiempo'] == 0) {
                     chutas.remove(chuta);
                 }
             });
 			this.fiestas.children.forEach(fiesta => {
 				fiesta['score'] -= 5;
 				if (!fiesta['score']) {
 					this.currentParties--;
 					this.fiestas.remove(fiesta);
 				}
 			});
 		}
		if (this.prevTime === time) { 
			this.prevTime = time + this.generateAfter;
			let row = parseInt(Math.random() * 40);
			while(row % 4) {
				row--;
			}
			let column = parseInt(Math.random() * 40);
			while(this.columnWasHouse(column) === -1) {
				column--;
			}
			let fiesta = game.add.sprite(row * 32, column * 32, 'fiesta');
			fiesta.animations.add('on', [0, 0], 10, true);
			fiesta.animations.play('on');
			fiesta['score'] = 100;
			this.currentParties++;
			game.physics.arcade.enable(fiesta);

			this.fiestas.addChild(fiesta);
			let tumba = game.add.sprite((row - 2) * 32, column * 32, 'tumba');
			tumba.animations.add('tumbaRotate', [0, 1, 2, 3], 2, true);
			game.physics.arcade.enable(tumba);
			this.tumbas.addChild(tumba);
			let tumba2 = game.add.sprite((row + 2) * 32, column * 32, 'tumba');
			tumba2.animations.add('tumbaRotate', [0, 1, 2, 3], 2, true);
			game.physics.arcade.enable(tumba2);
			this.tumbas.addChild(tumba2);
		}
		game.physics.arcade.collide(this.tumbas, this.tumbaBullets, this.bulletToTumba, null, this);
		game.physics.arcade.collide(this.fiestas, this.bullets, this.condonToFiestas, null, this);
		game.physics.arcade.collide(this.tumbas, this.bullets, this.condonToTumba, null, this);
		game.physics.arcade.collide(this.tumbas, this.bullets, this.condonToTumba, null, this);
		this.tumbas.children.forEach(tumba => {
			
			if (game.physics.arcade.distanceBetween(tumba, sprite) > 0 && game.physics.arcade.distanceBetween(tumba, sprite) < 160) {	
				game.physics.arcade.moveToObject(tumba, sprite, 220);
			} else {
				tumba.body.velocity.set(0);
			}
			game.physics.arcade.collide(sprite, tumba, () => {
                sprite.kill();
                lastTime = 0;
                prevTime = 0;
				cohetilloCount = 5;
				condonCount = 5;
				score = 0;
				currentParties = 0;
			});
			game.physics.arcade.collide(tumba, layer);
			tumba.animations.play('tumbaRotate');
			
		});
    game.physics.arcade.collide(sprite, layer);
		game.physics.arcade.collide(this.bullets, layer, this.collisionHandler, null, this);
		game.physics.arcade.collide(this.tumbaBullets, layer, this.collisionHandlerTumbaBullet, null, this);
		this.drugstores.children.forEach(drugstore => {
			if (drugstore['hasCondon'] && game.physics.arcade.distanceBetween(sprite, drugstore) < 60) {
				this.bullets.createMultiple(3, 'bullet', 0, false);
				this.condonCount += 3;
				drugstore['hasCondon'] = false;
				this.drugstores.remove(drugstore);
			}
		});

		stores.children.forEach(store => {
			if (store['hasCondon'] && game.physics.arcade.distanceBetween(sprite, store) < 60) {
				this.tumbaBullets.createMultiple(5, 'tumbaBullet', 0, false);
				this.cohetilloCount += 5;
				store['hasCondon'] = false;
				stores.remove(store);
			}
		});

		game.physics.arcade.collide(sprite, this.drugstores, this.collisionHandlerTumbaBullet, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    // Iniciando animacion de tumba

    var currentX = layer.getTileX(sprite.x);
    var currentY = layer.getTileY(sprite.y);

    if (this.cursors.left.isDown || wasd.left.isDown) {
        sprite.animations.play('left');
        if(currentX == 0) {justPressed
            sprite.body.velocity.x = 0;
        } else {
            sprite.body.velocity.x -= 200;
        }
    }
    if (this.cursors.right.isDown || wasd.right.isDown) {
        sprite.animations.play('right');
        if(currentX == this.gameWidth - 1) {
            sprite.body.velocity.x = 0;
        } else {
            sprite.body.velocity.x += 200;
        }
    }

    if (this.cursors.up.isDown || wasd.up.isDown) {
        sprite.animations.play('up');
        if(currentY == 0) {
            sprite.body.velocity.y = 0;
        } else {
            sprite.body.velocity.y -= 200;
        }
    }
    if (this.cursors.down.isDown || wasd.down.isDown) {
        sprite.animations.play('down');
        if(currentY == this.gameHeight - 1) {
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
        this.fire();
    }
    if(game.input.activePointer.rightButton.isDown){
        this.fireTumba();
    }
	if(game.input.activePointer.middleButton.isDown){
         this.superPoder();
     }

},

render: function() {
    
},

// Funcion disparar condon
fire: function () {
    if (game.time.now > this.nextFire && this.bullets.countDead() > 0 && this.condonCount > 0) {
        this.condonCount--;
        this.nextFire = game.time.now + this.fireRate;
        var bullet = this.bullets.getFirstExists(false);
        bullet.reset(turret.x, turret.y);
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }
},

fireTumba: function(){

  if (game.time.now > this.nextFire && this.tumbaBullets.countDead() > 0 && this.cohetilloCount > 0) {
      this.cohetilloCount--;
      this.nextFire = game.time.now + this.fireRate;
      var tumbaBullet = this.tumbaBullets.getFirstExists(false);
      tumbaBullet.reset(tumbaTurret.x, tumbaTurret.y);
      tumbaBullet.rotation = game.physics.arcade.moveToPointer(tumbaBullet, 1000, game.input.activePointer, 500);
    }
},

superPoder: function(){
	 var dx = [-1, 0 , 1, 1,  1, 0, -1, -1];
     var dy = [ 1, 1 , 1, 0, -1, -1, -1, 0];
     var dst = 30;
     var objs = [];
     if (game.time.now > nextFire) { 
         nextFire = game.time.now + fireRate;
         var pepinoX = sprite.x;
         var pepinoY = sprite.y;
         for(var i = 0 ; i < 8 ; i++) {
             if(i < 4) {
                 var chola = game.add.sprite(pepinoX + dx[i] * dst, pepinoY + dy[i] * dst, 'chola');
                 game.physics.arcade.enable(chola);
                 game.physics.arcade.collide(chola, tumbas, bulletToTumba, null, this);
                 chola.animations.add('dancing', [0, 1], 5, true);
                 chola.animations.play('dancing');
                 
                chola['tiempo'] = 1;
                 cholas.addChild(chola);
             } else {
                 var chuta = game.add.sprite(pepinoX + dx[i] * dst, pepinoY + dy[i] * dst, 'chuta-paceno');
                 chuta.animations.add('dancing', [0, 1], 5, true);
                 chuta.animations.play('dancing');
                 chuta['tiempo'] = 1;
                 chutas.addChild(chuta);
             }
         }
     }

},

bulletHitTumba : function (srpite, bullet) {
    tumbaBullet.kill();
},


updateTime : function() {
    this.seconds = Number.parseInt(this.seconds);
    this.minutes = Number.parseInt(this.minutes);
    if( this.seconds == 60){
        this.seconds = 0;
        this.minutes +=1; 
    }

    this.seconds += 1;
    if (this.minutes < 10) {
        this.minutes = "0" + this.minutes;
    }
    if (this.seconds < 10) {
        this.seconds = "0" + this.seconds;
    }

    timeString =  this.minutes + ":" + this.seconds;
    this.timeText.text = timeString;
    condonesText.text = "Condones: " + this.condonCount;
    cuetillosText.text = "Cohetillos: " + this.cohetilloCount;
}



}
