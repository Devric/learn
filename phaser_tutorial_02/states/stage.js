GameGlobal.GameStates.stage = class StateStage {
    constructor() {
        console.log('==>init:GameState:stage')

        this.assets = {
            background : { type : 'image'  , source : 'assets/sky.png' } ,
            wolf       : { type : 'sprite' , source : "assets/baddie.png"  , width : 32 , height : 32 , fames :4 , margin : 0 , spacing : 0 }
        }

        this.StageAsset = {
            background : null,
            wolf       : null,
            anim       : null,
            loopText   : null,
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

    // Phaser Game

    preload(){
        // Load Assets
        Util.assetLoader(this.game, this.assets)
    }
    create(){
        this.background = this.game.add.sprite(0,0, 'background')
        this.game.add.text(16,16,'Stage Fight!',{fontSize:'32px',fill:'#000'})

        this.wolf = this.game.add.sprite(100,100,'wolf')
        this.wolfWalkLeft  = this.wolf.animations.add('walkLeft',[0,1])
        this.wolfWalkRight = this.wolf.animations.add('walkRight',[2,3])
        this.wolfWalkRight.play(5,true)
    }
    update(){

    }
}

