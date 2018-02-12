//TODO: ver si es necesario pasar como parametro el `game`
function Pepino(x, y) {
    this.key = 'pepino';
    this.sprite = game.add.sprite(x, y, this.key);
    this.sprite.animations.add('stop', [4], 10, true);
    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('down', [8, 9], 10, true);
    this.sprite.animations.add('up', [10, 11], 10, true);
    this.sprite.animations.add('right', [5, 6, 7], 10, true);
    game.physics.arcade.enable(this.sprite);
    game.camera.follow(this.sprite);
}

Pepino.prototype.getKey = function() {
    return this.key;
}

Pepino.prototype.getSprite = function() {
    return this.sprite;
}

Pepino.prototype.die = function() {
    this.sprite.kill();
}

Pepino.prototype.setXVelocity = function(xVelocity) {
    this.sprite.body.velocity.x = xVelocity;
}

Pepino.prototype.setYVelocity = function(yVelocity) {
    this.sprite.body.velocity.y = yVelocity;
}

Pepino.prototype.stop = function() {
    this.setXVelocity(0);
    this.setYVelocity(0);
}

Pepino.prototype.showStopAnimation = function() {
    this.sprite.animations.play('stop');
}

Pepino.prototype.goLeft = function() {
    this.sprite.animations.play('left');
    this.setXVelocity(-200);
}

Pepino.prototype.goRight = function() {
    this.sprite.animations.play('right');
    this.setXVelocity(200);
}

Pepino.prototype.goUp = function() {
    this.sprite.animations.play('up');
    this.setYVelocity(-200);
}

Pepino.prototype.goDown = function() {
    this.sprite.animations.play('down');
    this.setYVelocity(200);
}