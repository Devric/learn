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
        this.game.world.setBounds(0,0,800,400)
        this.StageAsset.background = this.game.add.tileSprite(0,0, 640, 360, 'background')
        this.StageAsset.background.smoothed = false

        this.game.add.text(16,16,'Stage Fight!',{fontSize:'32px',fill:'#000'})

        this.wolf = this.game.add.sprite(100,100,'wolf')
        this.wolf.fixedToCamera = true
        this.wolfWalkLeft  = this.wolf.animations.add('walkLeft',[0,1])
        this.wolfWalkRight = this.wolf.animations.add('walkRight',[2,3])
        this.wolfWalkRight.play(5,true)
    }
    update(){
        // inifite scroll background 
        if (this.wolfWalkRight.isPlaying) {
            this.StageAsset.background.tilePosition.x -=1
        }

        // movement
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.game.camera.y -= 5;  
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.game.camera.y += 5;    
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.game.camera.x -= 5;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.game.camera.x += 5;
        }

    }

}

