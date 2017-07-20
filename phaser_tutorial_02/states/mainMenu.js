GameGlobal.GameStates.mainMenu = {
    preload: ()=>{
        console.log('GameState:MainMenu')
        Util.assetLoader(this.game, {
            background : { type:'image',source:'assets/startmenu.jpg' }
        })
    },
    create: ()=>{
        this.background = this.game.add.sprite(0,0, 'background')
        this.background.scale.setTo(2.2,3)

        setTimeout(function(){
            this.game.state.start('town')
        },1000)
    },
    update: ()=>{

    },
}

