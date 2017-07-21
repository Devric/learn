var Util={}

/**
 * Loaders
 */
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
Util.gameStateLoader = function assetLoader(game, states){
    for (var state in states) {
        game.state.add(state, states[state])
    }
}


/**
 * Save/load
 */
Util.saveGame = function saveGame(key, str) {
    localStorage.setItem(key,str);
}

Util.loadGame = function loadGame(key) {
    localStorage.getItem(key);
}

Util.deleteGame = function deleteGame(key) {
    localStorage.removeItem(key);
}


