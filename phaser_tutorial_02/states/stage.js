GameGlobal.GameStates.stage = class StateStage {
    constructor() {
        console.log('==>init:GameState:stage')

        this.assets = {
            background : { type:'image',source:'assets/sky.png' },
        }

        this.groups = {}

        this.characters = {
            hero  : {},
            npc   : {},
            enemy : {}
        }

        this.scene = {

        }

    }
    preload(){
        // Load Assets
        Util.assetLoader(this.game, this.assets)
    }
    create(){
        this.background = this.game.add.sprite(0,0, 'background')
        this.game.add.text(16,16,'Stage Fight!',{fontSize:'32px',fill:'#000'})
    }
    update(){

    }
}

