var game = new Phaser.Game(640,360, Phaser.AUTO)

console.log(GameGlobal)
for (var state in GameGlobal.GameStates) {
    game.state.add(state, GameGlobal.GameStates[state])
}

game.state.start('mainMenu')
