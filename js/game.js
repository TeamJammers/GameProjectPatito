var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('splash', splash);
game.state.add('tuto', tuto);
game.state.add('level1', level1);
//game.state.add('level2', level1);
//game.state.add('level3', level2);
//game.state.add('level4', level3); 
game.state.start('boot');