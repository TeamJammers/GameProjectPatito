var splash = {

	

	preload: function() {
	    game.load.image('splash','assets/jamsplash.jpg');
	},

	create: function(){
		game.add.sprite(0, 0, 'splash');
	var timer = game.time.create();
	    timer.repeat(3 * Phaser.Timer.SECOND, 7200, this.updateTime, this);
	    timer.start();

	},


	updateTime: function(){
		
			game.state.start('tuto');
		
		
	}

}
