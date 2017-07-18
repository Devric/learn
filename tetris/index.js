class Arena {
    constructor(w,h) {
        this.matrix = this.createMatrix(w,h)
    }

    createMatrix(w,h) {
        const matrix = []
        while (h--) {
            matrix.push(new Array(w).fill(0))
        }
        return matrix
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
                    player.move(-1, player.Game.collide, player.Game.arena)
                break;

                case 39: // right
                    player.move(1, player.Game.collide, player.Game.arena)
                break;

                case 40: // down
                    player.drop()
                break;

                case 32: // space
                    player.quickDrop()
                break;

                case 81: // w
                    player.rotate(-1, player.Game.rotate, player.Game.collide, player.Game.arena)
                break;

                case 87: // q
                    player.rotate(1, player.Game.rotate, player.Game.collide, player.Game.arena)
                break;
            }
        })
    }

    move(dir, collide,arena) {
        var player = this
        player.pos.x += dir
        if (collide(arena, player)) {
            player.pos.x -= dir
        }
    }

    rotate(dir, rotate, collide, arena) {
        var player=this
        const pos=player.pos.x
        let offset=1
        player._rotate(player.matrix, dir)
        while(collide(arena, player)) {
            player.pos.x += offset
            offset = -(offset + ( offset > 0 ? 1 : -1 ));
            if (offset > player.matrix[0].length) {
                player._rotate(player.matrix, -dir)
                player.pos.x = pos
                return
            }
        }
    }

    reset() {
        var player=this

        player.matrix = player.Game.createPiece()
        player.pos.y  = 0
        player.pos.x  = ( player.Game.arena[0].length / 2 | 0 ) - ( player.matrix[0].length / 2 | 0 )

        // when it is full
        if (player.Game.collide(player.Game.arena, player)) {
            player.Game.arena.forEach( row => row.fill(0) )
            player.score = 0
            player.Game.updateScore()
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

    drop() {
        var player = this
        player.pos.y++;
        if (player.Game.collide(player.Game.arena,player)) {
            // move player up
            player.pos.y--

            // merge the arena and player
            player.Game.merge(player.Game.arena,player)
            player.reset()
            player.Game.arenaSweep()

            // restart from top
            player.pos.y=0
        }
        player.dropCounter = 0
    }

    quickDrop() {
        var player = this
        while ( !player.Game.collide(player.Game.arena,player) ) {
            player.pos.y++;
        }

        if ( player.Game.collide(player.Game.arena,player) ) {
            // move player up
            player.pos.y--

            // merge the arena and player
            player.Game.merge(player.Game.arena,player)
            player.reset()
            player.Game.arenaSweep()

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
        this.arena    = new Arena(12,20).matrix
        this.lastTime = 0

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

        this.player = new Player(this)

        // init player
        self.player.reset()
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

    // this to trap the matrix within the arena
    merge(arena, player) {
        player.matrix.forEach((row,y)=>{
            row.forEach( (value, x) => {
                if (value !==0) {
                    arena[y+player.pos.y][x+player.pos.x] = value
                }
            })
        })
    }

    collide(arena, player) {
        const [m,o] = [player.matrix, player.pos]
        for (let y=0;y<m.length;++y) {
            for (let x=0; x < m[y].length; ++x) {
                let isNotZero = m[y][x] > 0;
                let arenaYPos = arena[y+o.y]

                if( isNotZero && ( arenaYPos && arenaYPos[x+o.x] ) !==0 ) {
                    return true
                }
            }
        }
        return false
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

    arenaSweep() {
        var self=this
        let rowCount = 1
        outer: for (let y = self.arena.length - 1; y > 0; --y) {
            for (let x = 0; x < self.arena[y].length; ++x) {
                if ( self.arena[y][x] === 0 ) {
                    continue outer;
                }
            }

            // REMOVE arena row out at 'y' pos, and fill it with 0
            const row = self.arena.splice(y,1)[0].fill(0)

            // add it from the top
            self.arena.unshift(row)

            // offset y
            y++

            self.player.score += rowCount * 10;
            rowCount *= 2;
            self.updateScore()
        }
    }

}

new Tetris()

