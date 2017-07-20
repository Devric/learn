GameGlobal.GameStates.mainMenu = class StateMainMenu {
    constructor() {
        console.log('==>init:GameState:MainMenu')

        this.assets = {
            background : { type:'image',source:'assets/startmenu.jpg' }
        }
    
    }
    preload(){
        // Load Assets
        Util.assetLoader(this.game, this.assets)
    }
    create(){
        this.background = this.game.add.sprite(0,0, 'background')
        this.background.scale.setTo(2.2,3)

        setTimeout(function(){
            this.game.state.start('town')
        },1000)
    }
    update(){

    }
}

