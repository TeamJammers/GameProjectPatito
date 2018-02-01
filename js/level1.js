function goFullScreen() {
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
    }
    else {
        game.scale.startFullScreen(false);
    }
}

function setScore(score) {
    if (!score) score = 0;
    /* var best = localStorage.getItem('bestScore');
    best = Math.max(best, score);
    localStorage.setItem('bestScore', best);
    var div = document.getElementById('score');
    div.innerHTML = "<h1 style='padding-top: 50px;'> Best Score " + best + "</h1>" */
}
setScore();
var level1 = {
    PEPINO_KEY: 'pepino',
    preload: function () {
        game.load.tilemap('desert', 'assets/desert.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tmw_desert_spacing.png');
        game.load.image('bullet', 'assets/jam-condon.png');
        game.load.image('tumbaBullet', 'assets/cuetillo.png');

        game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
        game.load.spritesheet(this.PEPINO_KEY, 'assets/dude.png', 32, 48);
        game.load.audio('chuta', 'assets/audio/chutaalegre.m4a');
        game.load.spritesheet('tumba', 'assets/tumba.png', 31, 48);
        game.load.spritesheet('fiesta', 'assets/fiesta.png', 32, 32);

        game.load.spritesheet('drugstore', 'assets/red-cross.png');
        game.load.spritesheet('store', 'assets/tienda-cuetillo.png');

        game.load.spritesheet('chola', 'assets/chola.png', 32, 32);
        game.load.spritesheet('chuta-paceno', 'assets/chuta.png', 32, 32);

    },

    map: null,
    layer: null,
    score: 0,

    cursors: null,
    pepino: null,
    tumbas: null,

    spriteText: null,

    gameHeight: 40,
    gameWidth: 40,

    enemies: null,
    enemyBullets: null,
    enemiesTotal: 0,
    enemiesAlive: 0,
    explosions: null,

    currentSpeed: 0,
    cursors: null,

    bullets: null,
    tumbaBullets: null,
    fireRate: 100,
    nextFire: 0,

    timeString: null,
    condonString: null,
    cuetilloString: null,
    partiesString: null,
    scoreString: null,
    timeText: null,

    timeReopen: 20,
    fiestas: null,

    chutas: null,
    cholas: null,

    chuta: null,
    chola: null,
    drugstores: null,
    stores: null,
    audioCarnaval: null,

    //time of level

    minutes: null,
    seconds: null,

    prevTime: 0,
    currentParties: 0,

    drugstoreSet: new Set(),
    storeSet: new Set(),
    condonCount: 5,
    cohetilloCount: 5, // #spanglish :V
    create: function () {
        var self = this;
        console.log("lvl1");
        document.addEventListener('contextmenu', function (event) { event.preventDefault(); });
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('desert');
        map.addTilesetImage('Desert', 'tiles');
        map.setCollision([3, 4, 5, 6]);
        layer = map.createLayer('Ground');
        layer.resizeWorld();

        this.fiestas = game.add.group();
        this.fiestas.enableBody = true;

        this.drugstores = game.add.group();
        this.drugstores.enableBody = true;
        for (let i = 0; i < 2; i++) {
            let row = parseInt(Math.random() * 40);
            while (row % 4) {
                row--;
            }
            let column = parseInt(Math.random() * 40);
            while (this.columnWasHouse(column) === -1) {
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
        this.stores = game.add.group();
        this.stores.enableBody = true;
        let lim = 2;
        for (let i = 0; i < lim; i++) {
            let row = parseInt(Math.random() * 40);
            while (row % 4) {
                row--;
            }
            let column = parseInt(Math.random() * 40);
            while (this.columnWasHouse(column) === -1) {
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
            this.stores.addChild(store);
        }

        self.pepino = new Pepino(400, 200);

        spriteText = game.add.sprite(0, 0);
        spriteText.fixedToCamera = true;

        turret = game.add.sprite(0, 0, 'turret');
        turret.visible = false;
        turret.anchor.setTo(0.3, 0.5);

        tumbaTurret = game.add.sprite(0, 0, 'tumbaturret');
        tumbaTurret.visible = false;
        tumbaTurret.anchor.setTo(0.3, 0.5);
        // audio


        // audio
        if (!this.audioCarnaval) {
            this.audioCarnaval = game.add.audio('chuta');
            this.audioCarnaval.play();
            this.audioCarnaval.loopFull(1);
        }

        this.tumbas = game.add.group();
        this.tumbas.enableBody = true;
        

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

        this.cursors = game.input.keyboard.createCursorKeys();

        wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };


        var style = { fill: "#FFFFFF" };
        this.timeText = game.add.text(10, 10, this.timeString, style);
        cuetillosText = game.add.text(100, 10, this.cuetilloString, style);
        condonesText = game.add.text(300, 10, this.condonString, style);

        partiesText = game.add.text(500, 10, this.partiesString, style);
        scoreText = game.add.text(650, 10, this.scoreString, style);

        spriteText.addChild(this.timeText);
        spriteText.addChild(cuetillosText);
        spriteText.addChild(condonesText);
        spriteText.addChild(partiesText);
        spriteText.addChild(scoreText);

        this.seconds = 0;
        this.minutes = 0;

        this.seconds = Number.parseInt(this.seconds);
        this.minutes = Number.parseInt(this.minutes);

        var timer = game.time.create();
        timer.repeat(1 * Phaser.Timer.SECOND, 7200, this.updateTime, this);
        timer.start();
    },

    collisionHandler: function (bullet) {
        bullet.body.enable = false;
        // bullet.kill();
        // bullet.destroy();
        this.bullets.remove(bullet);
        // console.log(':O');
    },
    collisionHandlerTumbaBullet: function (bullet, type) {
        bullet.body.enable = false;
        // bullet.kill();
        // bullet.destroy();
        this.tumbaBullets.remove(bullet);
        // console.log(':O');
    },
    generateAfter: 8,
    columnWasHouse: function (column) {
        for (let i = 0; i < 4; i++) {
            if (!((column - i) % 8)) {
                return column;
                collide
            }
        }
        return -1;
    },
    condonToFiestas: function (fiesta, condon) {
        this.score += fiesta['score'];
        this.currentParties--;
        fiesta.kill();
    },
    condonToTumba: function (tumba, condon) {
        condon.kill();
    },
    bulletToTumba: function (tumba, bullet) {
        tumba.kill();
        bullet.kill();
    },
    lastTime: 0,
    update: function () {
        var self = this;
        const time = parseInt(this.minutes) * 60 + parseInt(this.seconds);
        if (self.timeReopen === time) {
            self.timeReopen += 20;
            self.drugstoreSet.forEach(coordinates => {
                console.log(coordinates);
                let row = +coordinates.split('-')[0];
                let column = +coordinates.split('-')[1];
                let drugstore = game.add.sprite(row * 32, column * 32, 'drugstore');
                drugstore.animations.add('on', [0, 0], 10, true);
                game.physics.arcade.enable(drugstore);
                drugstore['hasCondon'] = true;
                drugstore.body.velocity.set(0);
                self.drugstores.addChild(drugstore);
            });
            self.storeSet.forEach(coordinates => {
                let row = +coordinates.split('-')[0];
                let column = +coordinates.split('-')[1];
                console.log(coordinates, row, column);
                let store = game.add.sprite(row * 32, column * 32, 'store');
                store.animations.add('on', [0, 0], 10, true);
                game.physics.arcade.enable(store);
                store['hasCondon'] = true;
                store.body.velocity.set(0);
                console.log(self.stores);
                console.log(self);
                self.stores.addChild(store);
            });
        }
        if (time > self.lastTime) {
            self.lastTime = time;
            self.cholas.children.forEach((chola) => {
                chola['tiempo']--;
                if (chola['tiempo'] == 0) {
                    self.cholas.remove(chola);
                }
            });
            self.chutas.children.forEach((chuta) => {
                chuta['tiempo']--;
                if (chuta['tiempo'] == 0) {
                    self.chutas.remove(chuta);
                }
            });
            self.fiestas.children.forEach(fiesta => {
                fiesta['score'] -= 5;
                if (!fiesta['score']) {
                    if (self.currentParties > 0) {
                        self.currentParties--;
                    }
                    self.fiestas.remove(fiesta);
                }
            });
        }
        if (self.prevTime === time) {
            self.prevTime = time + self.generateAfter;
            let row = parseInt(Math.random() * 40);
            while (row % 4) {
                row--;
            }
            let column = parseInt(Math.random() * 40);
            while (self.columnWasHouse(column) === -1) {
                column--;
            }
            let fiesta = game.add.sprite(row * 32, column * 32, 'fiesta');
            fiesta.animations.add('on', [0, 0], 10, true);
            fiesta.animations.play('on');
            fiesta['score'] = 100;
            self.currentParties++;
            game.physics.arcade.enable(fiesta);

            self.fiestas.addChild(fiesta);
            let tumba = game.add.sprite((row - 2) * 32, column * 32, 'tumba');
            tumba.animations.add('tumbaRotate', [0, 1, 2, 3], 2, true);
            game.physics.arcade.enable(tumba);
            self.tumbas.addChild(tumba);
            let tumba2 = game.add.sprite((row + 2) * 32, column * 32, 'tumba');
            tumba2.animations.add('tumbaRotate', [0, 1, 2, 3], 2, true);
            game.physics.arcade.enable(tumba2);
            self.tumbas.addChild(tumba2);
        }
        game.physics.arcade.collide(self.tumbas, self.tumbaBullets, self.bulletToTumba, null, self);
        game.physics.arcade.collide(self.fiestas, self.bullets, self.condonToFiestas, null, self);
        game.physics.arcade.collide(self.tumbas, self.bullets, self.condonToTumba, null, self);
        game.physics.arcade.collide(self.tumbas, self.bullets, self.condonToTumba, null, self);
        self.tumbas.children.forEach(tumba => {
            if (game.physics.arcade.distanceBetween(tumba, self.pepino.getSprite()) > 0 && game.physics.arcade.distanceBetween(tumba, self.pepino.getSprite()) < 160) {
                game.physics.arcade.moveToObject(tumba, self.pepino.getSprite(), 220);
            } else {
                tumba.body.velocity.set(0);
            }
            game.physics.arcade.collide(self.pepino.getSprite(), tumba, () => {
                self.pepino.die();
                /* setScore(self.score); */
                self.lastTime = 0;
                self.prevTime = 0;
                self.cohetilloCount = 5;
                self.condonCount = 5;
                self.score = 0;

                self.currentParties = 0;

                self.game.state.restart();
            });
            game.physics.arcade.collide(tumba, layer);
            tumba.animations.play('tumbaRotate');

        });
        game.physics.arcade.collide(self.pepino.getSprite(), layer);
        game.physics.arcade.collide(self.bullets, layer, self.collisionHandler, null, self);
        game.physics.arcade.collide(self.tumbaBullets, layer, self.collisionHandlerTumbaBullet, null, self);
        self.drugstores.children.forEach(drugstore => {
            if (drugstore['hasCondon'] && game.physics.arcade.distanceBetween(self.pepino.getSprite(), drugstore) < 60) {
                self.bullets.createMultiple(3, 'bullet', 0, false);
                self.condonCount += 3;
                drugstore['hasCondon'] = false;
                self.drugstores.remove(drugstore);
            }
        });

        self.stores.children.forEach(store => {
            if (store['hasCondon'] && game.physics.arcade.distanceBetween(self.pepino.getSprite(), store) < 60) {
                self.tumbaBullets.createMultiple(5, 'tumbaBullet', 0, false);
                self.cohetilloCount += 5;
                store['hasCondon'] = false;
                self.stores.remove(store);
            }
        });

        game.physics.arcade.collide(self.pepino.getSprite(), self.drugstores, self.collisionHandlerTumbaBullet, null, self);

        self.pepino.stop();

        var currentX = layer.getTileX(self.pepino.getSprite().x);
        var currentY = layer.getTileY(self.pepino.getSprite().y);

        if (self.cursors.left.isDown || wasd.left.isDown) {
            if (currentX == 0) {
                self.pepino.stop();
            } else {
                self.pepino.goLeft();
            }
        }
        if (self.cursors.right.isDown || wasd.right.isDown) {
            if (currentX == self.gameWidth - 1) {
                self.pepino.stop();
            } else {
                self.pepino.goRight();
            }
        }

        if (self.cursors.up.isDown || wasd.up.isDown) {
            if (currentY == 0) {
                self.pepino.stop(0);
            } else {
                self.pepino.goUp();
            }
        }
        if (self.cursors.down.isDown || wasd.down.isDown) {
            if (currentY == self.gameHeight - 1) {
                self.pepino.stop();
            } else {
                self.pepino.goDown();
            }
        }

        turret.x = self.pepino.getSprite().x;
        turret.y = self.pepino.getSprite().y;
        turret.rotation = game.physics.arcade.angleToPointer(turret);
        tumbaTurret.x = self.pepino.getSprite().x;
        tumbaTurret.y = self.pepino.getSprite().y;
        turret.rotation = game.physics.arcade.angleToPointer(tumbaTurret);

        if (game.input.activePointer.leftButton.isDown) {
            //  Boom!
            self.fire();
        }
        if (game.input.activePointer.rightButton.isDown) {
            self.fireTumba();
        }
        if (game.input.activePointer.middleButton.isDown) {
            self.superPoder();
        }

    },

    render: function () {

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

    fireTumba: function () {

        if (game.time.now > this.nextFire && this.tumbaBullets.countDead() > 0 && this.cohetilloCount > 0) {
            this.cohetilloCount--;
            this.nextFire = game.time.now + this.fireRate;
            var tumbaBullet = this.tumbaBullets.getFirstExists(false);
            tumbaBullet.reset(tumbaTurret.x, tumbaTurret.y);
            tumbaBullet.rotation = game.physics.arcade.moveToPointer(tumbaBullet, 1000, game.input.activePointer, 500);
        }
    },

    superPoder: function () {
        var dx = [-1, 0, 1, 1, 1, 0, -1, -1];
        var dy = [1, 1, 1, 0, -1, -1, -1, 0];
        var dst = 30;
        var objs = [];
        if (game.time.now > this.nextFire) {
            this.nextFire = game.time.now + this.fireRate;
            var pepinoX = this.pepino.x;
            var pepinoY = this.pepino.y;
            for (var i = 0; i < 8; i++) {
                if (i < 4) {
                    var chola = game.add.sprite(pepinoX + dx[i] * dst, pepinoY + dy[i] * dst, 'chola');
                    game.physics.arcade.enable(chola);
                    game.physics.arcade.collide(chola, this.tumbas, this.bulletToTumba, null, this);
                    chola.animations.add('dancing', [0, 1], 5, true);
                    chola.animations.play('dancing');

                    chola['tiempo'] = 1;
                    this.cholas.addChild(chola);
                } else {
                    var chuta = game.add.sprite(pepinoX + dx[i] * dst, pepinoY + dy[i] * dst, 'chuta-paceno');
                    chuta.animations.add('dancing', [0, 1], 5, true);
                    chuta.animations.play('dancing');
                    chuta['tiempo'] = 1;
                    this.chutas.addChild(chuta);
                }
            }
        }

    },
    updateTime: function () {
        this.seconds = Number.parseInt(this.seconds);
        this.minutes = Number.parseInt(this.minutes);
        if (this.seconds == 60) {
            this.seconds = 0;
            this.minutes += 1;
        }

        this.seconds += 1;
        if (this.minutes < 10) {
            this.minutes = "0" + this.minutes;
        }
        if (this.seconds < 10) {
            this.seconds = "0" + this.seconds;
        }

        timeString = this.minutes + ":" + this.seconds;
        this.timeText.text = timeString;
        condonesText.text = "Condones: " + this.condonCount;
        cuetillosText.text = "Cohetillos: " + this.cohetilloCount;
        partiesText.text = "Fiestas: " + this.currentParties;
        scoreText.text = "Score: " + this.score;
    }



}
