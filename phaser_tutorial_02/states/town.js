GameGlobal.GameStates.town = class StateTown {
    constructor() {
        console.log('==>init:GameState:town')

        this.assets = {
            background : { type:'image',source:'assets/sky.png' },
            btn_fight : { type:'image',source:'assets/btn_fight.jpg' },
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
        this.game.add.text(16,16,'Town',{fontSize:'32px',fill:'#000'})

        this.btn_startStage = game.add.button(this.game.world.centerX /2, 100, 'btn_fight', ()=>{
            this.game.state.start('stage')
        }, this, 2,1,0 )

        // this persist the change state with btn_startStage button
        // this.game.stage.addChild(this.btn_startStage)
    }
    update(){

    }
}

