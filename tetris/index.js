class Arena {
    constructor(w,h, Game) {
        this.matrix = this.createMatrix(w,h)
        this.Game   = Game
        return this
    }

    createMatrix(w,h) {
        const matrix = []
        while (h--) {
            matrix.push(new Array(w).fill(0))
        }
        return matrix
    }

    sweep() {
        var self=this
        let rowCount = 1
        outer: for (let y = this.matrix.length - 1; y > 0; --y) {
            for (let x = 0; x < this.matrix[y].length; ++x) {
                if ( this.matrix[y][x] === 0 ) {
                    continue outer;
                }
            }

            // REMOVE arena row out at 'y' pos, and fill it with 0
            const row = this.matrix.splice(y,1)[0].fill(0)

            // add it from the top
            this.matrix.unshift(row)

            // offset y
            y++

            this.Game.player.score += rowCount * 10;
            rowCount *= 2;
            this.Game.updateScore()
        }
    }

    // this to trap the matrix within the arena
    merge(player) {
        player.matrix.forEach((row,y)=>{
            row.forEach( (value, x) => {
                if (value !==0) {
                    this.matrix[y+player.pos.y][x+player.pos.x] = value
                }
            })
        })
    }

    collide(player) {
        const [m,o] = [player.matrix, player.pos]
        for (let y=0;y<m.length;++y) {
            for (let x=0; x < m[y].length; ++x) {
                let isNotZero = m[y][x] > 0;
                let arenaYPos = this.matrix[y+o.y]

                if( isNotZero && ( arenaYPos && arenaYPos[x+o.x] ) !==0 ) {
                    return true
                }
            }
        }
        return false
    }

    clear() {
        this.matrix.forEach( row => row.fill(0) )
    }
}

class Player {
    constructor(Game) {
        this.Game   = Game
        this.pos    = {}
        this.matrix = ""
        this.score  = 0

        this.lastTime     = 0
        this.dropCounter  = 0
        this.dropInterval = 300

        this.init()
    }

    init() {
        var player = this
        document.addEventListener('keydown', e => {
            switch ( e.keyCode ) {
                case 37: // left
                    player.move(-1)
                break;

                case 39: // right
                    player.move(1)
                break;

                case 40: // down
                    player.drop()
                break;

                case 32: // space
                    player.quickDrop()
                break;

                case 81: // w
                    player.rotate(-1)
                break;

                case 87: // q
                    player.rotate(1)
                break;
            }
        })

        this.reset()
    }

    move(dir) {
        var player = this
        player.pos.x += dir
        if (player.Game.Arena.collide(player)) {
            player.pos.x -= dir
        }
    }

    rotate(dir) {
        var player=this
        const pos=player.pos.x
        let offset=1
        player._rotate(player.matrix, dir)
        while(player.Game.Arena.collide(player)) {
            player.pos.x += offset
            offset = -(offset + ( offset > 0 ? 1 : -1 ));
            if (offset > player.matrix[0].length) {
                player._rotate(player.matrix, -dir)
                player.pos.x = pos
                return
            }
        }
    }

    _rotate(matrix,dir){
        for (let y=0;y<matrix.length;y++){
            for (let x=0; x<y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                    matrix[y][x],
                    matrix[x][y],
                ]
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse())
        } else {
            matrix.reverse()
        }
    }

    reset() {
        var player=this

        player.matrix = player.Game.createPiece()
        player.pos.y  = 0
        player.pos.x  = ( player.Game.arena[0].length / 2 | 0 ) - ( player.matrix[0].length / 2 | 0 )

        // when it is full
        if (player.Game.Arena.collide(player)) {
            player.Game.Arena.clear()
            player.score = 0
            player.Game.updateScore()
        }
    }

    drop() {
        var player = this
        player.pos.y++;
        if (player.Game.Arena.collide(player)) {
            // move player up
            player.pos.y--

            // merge the arena and player
            player.Game.Arena.merge(player)
            player.reset()
            player.Game.Arena.sweep()

            // restart from top
            player.pos.y=0
        }
        player.dropCounter = 0
    }

    quickDrop() {
        var player = this
        while ( !player.Game.Arena.collide(player) ) {
            player.pos.y++;
        }

        if ( player.Game.Arena.collide(player) ) {
            // move player up
            player.pos.y--

            // merge the arena and player
            player.Game.Arena.merge(player)
            player.reset()
            player.Game.Arena.sweep()

            // restart from top
            player.pos.y=0
        }

        // reset 
        player.dropCounter  = 0
    }

    update(deltaTime) {
        this.dropCounter += deltaTime
        if(this.dropCounter > this.dropInterval) {
            this.drop()
        }
    }
}

class Tetris {
    constructor(GameEl='tetris', ScoreEl='score') {
        var self     = this

        this.canvas  = document.getElementById(GameEl)
        this.ctx     = this.canvas.getContext('2d')
        this.ctx.scale(20,20)

        // scoreboard
        this.scoreEl = document.getElementById(ScoreEl)

        // 20 height
        // 12 wide
        this.Arena    = new Arena(12,20, this)
        this.arena    = this.Arena.matrix
        this.lastTime = 0

        this.player = new Player(this)

        this.colors = [
            null,
            'red',
            'blue',
            'purple',
            'orange',
            'pink',
            'yellow',
            'green',
        ]


        // init player
        self.updateFrame()
        self.updateScore()
    }

    createPiece(type) {
        const pieces = "ILJOTSZ"
        const TYPES = {
            "T" : [
                [0,0,0],
                [1,1,1],
                [0,1,0],
            ],
            "O": [
                [2,2],
                [2,2],
            ],
            "L": [
                [0,3,0],
                [0,3,0],
                [0,3,3],
            ],
            "J": [
                [0,4,0],
                [0,4,0],
                [4,4,0],
            ],
            "I": [
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
            ],
            "S": [
                [0,6,6],
                [6,6,0],
                [0,0,0],
            ],
            "Z": [
                [7,7,0],
                [0,7,7],
                [0,0,0],
            ]
        }

        // randomize player piece or passed in value
        return type ? TYPES[type] : TYPES[pieces[ pieces.length * Math.random() | 0 ]]
    }

    updateScore(bonus = 0 ) {
        var {scoreEl, player} = this
        scoreEl.innerText = player.score + (bonus * 10)
    }


    updateFrame(time=0) {
        var self=this

        const deltaTime   = time - this.lastTime
        this.lastTime     = time
        self.player.update(deltaTime)

        self.draw()
        requestAnimationFrame(self.updateFrame.bind(this))
    }

    draw() {
        var self=this
        self.ctx.fillStyle = '#eee'
        self.ctx.fillRect(0,0, self.canvas.width, self.canvas.height)
        self.ctx.quadraticCurveTo (90, 10, 90, 20)

        self._drawMatrix(self.arena,{x:0,y:0})
        self._drawMatrix(self.player.matrix, self.player.pos)
    }

    _drawMatrix(matrix, offset) {
        var self=this
        matrix.forEach((row,y) => {
            row.forEach((value, x) => {
                if (value !==0) {
                    self.ctx.fillStyle = self.colors[value]
                    self.ctx.fillRect(x + offset.x, y + offset.y ,1,1)
                }
            }) 
        })
    }
}

var T1 = new Tetris('tetris1','score1')
var T2 = new Tetris('tetris2','score2')

