GameGlobal.GameStates.town = {
    preload: ()=>{
        console.log('GameState:town')
        Util.assetLoader(this.game, {
            background : { type:'image',source:'assets/sky.png' }
        })
    },
    create: ()=>{
        this.background = this.game.add.sprite(0,0, 'background')
        this.game.add.text(16,16,'Town',{fontSize:'32px',fill:'#000'})
    },
    update: ()=>{
        
    },
}

