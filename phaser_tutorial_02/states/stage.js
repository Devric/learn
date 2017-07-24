class Status {
    constructor(game,cfg) {
        this.amount = 100
        this.name   = 'hp'
    }
    add(amt){
        return this.amount += amt
    }
    drop(amt){
        return this.amount -= amt
    }
    get(){
        return this.amount
    }
    showBar(){

    }
}

class Character extends Phaser.Sprite{
    constructor(game,x,y,key) {
        //super(game, x,y,key,frame,group)
        super(game, x, y,key,0)

        this.game=game

        this.hp = new Status()
        this.hpBar = game.add.text(x,y-50,this.hp.get(),{fontSize:'22px',fill:'#000'})
        this.game.physics.arcade.enable(this)
        this.body.gravity.y = 300
        game.add.existing(this)
        
    }
    create() {
    }
    heal(amt) {
        this.hpBar.setText(this.hp.add(amt))
    }
    damaged(amt) {
        this.hpBar.setText(this.hp.drop(amt))
        if (this.hp.get() <= 0) this.kill()
    }
}

class Hero extends Character{
    constructor(game,x,y, index=0) {
        //super(game, x,y,key,frame,group)
        super(game, x, y,'hero',0)

        this.name = 'dude' + index
        this.animations.add('walkLeft'  , [0 , 1 , 2 , 4])
        this.animations.add('walkRight' , [5 , 6 , 7 , 8])

        // set inital frame
        this.frame=4
        this.cursors = game.input.keyboard.createCursorKeys();


        this.body.collideWorldBounds = true

        this.stat = {
            damage : 45
        }
    }
    walk(direction) {
        switch (direction) {
            case "left":
                this.animations.play('walkLeft',5,true)
                this.body.velocity.x +=1
                //this.damaged()
            break; case "right":
                this.animations.play('walkRight',5,true)
                //this.heal()
            break;
            case "stop":
            default:
                this.animations.stop()
                this.frame=4
        }
    }
    update() {
        this.walk('right')
        this.body.velocity.x +=0.5
        // if ( this.cursors.left.isDown ) {
        //     this.walk('left')
        // }
        // else if ( this.cursors.right.isDown ) {
        //     this.walk('right')
        // }
        // else {
        //     this.walk()
        // }
    }
}

class Wolf extends Character{
    constructor(game,x,y, index=0) {
        //super(game, x,y,key,frame,group)
        super(game, x, y,'wolf',0)

        this.name = 'Wolf' + index

        this.animations.add('walkLeft'  , [0 , 1])
        this.animations.add('walkRight' , [2 , 3])
        this.animations.play('walkLeft',5,true)

        this.body.collideWorldBounds = true

        this.stat = {
            damage : 25
        }
    }
    update() {
        this.body.velocity.x -=0.5
    }
}

GameGlobal.GameStates.stage = class StateStage {
    constructor() {
        console.log('==>init:GameState:stage')

        this.assets = {
            background : { type : 'image'  , source : 'assets/sky.png' },
            ground     : { type : 'image'  , source : "assets/platform.png"} ,
            wolf       : { type : 'sprite' , source : "assets/baddie.png"   , width : 32 , height : 32 , fames : 4 , margin : 0 , spacing : 0 } ,
            hero       : { type : 'sprite' , source : "assets/dude.png"     , width : 32 , height : 48 , fames : 9 , margin : 0 , spacing : 0 } ,
        }

        this.settings = {
            groundYPos : 210
        }

        this.StageAsset = {
            background : null,
            wolf       : null,
            anim       : null,
            loopText   : null,
        }

        this.groups = {
            platforms : null
        }

        this.characters = {
            hero  : {},
            npc   : {},
            enemy : {}
        }

        this.scene = {
            zoom : 1
        }

    }

    // Phaser Game

    preload(){
        // Load Assets
        Util.assetLoader(this.game, this.assets)
    }
    create(game){
        game.physics.startSystem(Phaser.Physics.ARCADE)
        //game.physics.arcade.gravity.y = 100;

        // background
        game.world.setBounds(0,0,this.world.width,400)
        this.StageAsset.background = game.add.tileSprite(0,0, this.world.width, 360, 'background')
        this.StageAsset.background.smoothed = false

        // text
        game.add.text(16,16,'Stage Fight!',{fontSize:'32px',fill:'#000'})

        // ground
        this.groups.platforms = game.add.group()
        this.groups.platforms.enableBody = true
        this.ground = this.groups.platforms.create(0, 298, 'ground')
        this.ground.body.immovable = true
        this.ground.scale.setTo(2,2)

        // this.dude = game.add.sprite(100,this.settings.groundYPos,'hero',4)
        this.dude = new Hero(game, 100,this.settings.groundYPos)

        //this.wolf = new Wolf(game, 500,this.settings.groundYPos+17)
        this.wolf = new Wolf(game, 500,this.settings.groundYPos+17)

        // different colour
        // this.wolf.tint = Math.random() * 0xffffff;

        game.world.setBounds(-500,-1000,4000,2000)


        game.camera.follow(this.dude, Phaser.Camera.FOLLOW_PLATFORMER);
    }
    update(){
        game.physics.arcade.collide(this.dude,this.ground)
        game.physics.arcade.collide(this.wolf,this.ground)
        game.physics.arcade.collide(this.wolf,this.dude, (wolf,player)=>{
            var knock = 70
            wolf.damaged(player.stat.damage)
            player.damaged(wolf.stat.damage)

            wolf.body.velocity.x = knock
            player.body.velocity.x = -knock
        })

        // inifite scroll background 
        //if (this.wolf.animations.getAnimation('walkLeft').isPlaying) {
        //    this.StageAsset.background.tilePosition.x -=1
        //}

        // the dudes animation update
        this.dude.update()

        // // movement
        // if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        //     game.camera.y -= 5;  
        // }
        // else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        //     game.camera.y += 5;    
        // }
        // if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        //     game.camera.x -= 5;
        // }
        // else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        //     game.camera.x += 5;
        // }

        if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
            if (this.scene.zoom < 10) this.scene.zoom += .2
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            if (this.scene.zoom > 1) this.scene.zoom -= .2
        }

        game.world.scale.setTo(this.scene.zoom)
    }
}

