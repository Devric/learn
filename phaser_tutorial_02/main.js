var game = new Phaser.Game(640,360, Phaser.AUTO)

// loading game states
Util.gameStateLoader(game, GameGlobal.GameStates)

// start game
game.state.start('mainMenu')

