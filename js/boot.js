var boot = {
	create: function(){

		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.state.start('load');
	}

}