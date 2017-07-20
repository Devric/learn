var Util={}
Util.assetLoader = function assetLoader(game, list){
    var k=0
    for (k in list) {
        var asset=list[k]
        switch(asset.type) {
            case 'image':
                game.load.image(k,asset.source)
            break;
            case 'sprite':
                game.load.spritesheet(
                    k,
                    asset.source,
                    asset.width,
                    asset.height,
                    asset.frames,
                    asset.margin,
                    asset.spacing
            )
            break;
        }
    }
}
