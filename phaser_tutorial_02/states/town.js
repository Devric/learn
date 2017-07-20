GameGlobal.GameStates.town = class StateTown {
    constructor() {
        console.log('==>init:GameState:town')

        this.assets = {
            background : { type:'image',source:'assets/sky.png' }
        }
    }
    preload(){
        // Load Assets
        Util.assetLoader(this.game, this.assets)
    }
    create(){
        this.background = this.game.add.sprite(0,0, 'background')
        this.game.add.text(16,16,'Town',{fontSize:'32px',fill:'#000'})
    }
    update(){

    }
}

