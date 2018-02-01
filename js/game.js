var game = new Phaser.Game(800, 600, Phaser.AUTO, 'pepino-carnavalero');

game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('splash', splash);
game.state.add('tuto', tuto);
game.state.add('level1', level1);
game.state.start('boot');

game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;