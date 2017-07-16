class Tetris {
    constructor() {
        var self    = this
        this.canvas = document.getElementById("tetris")
        this.ctx    = this.canvas.getContext('2d')

        this.ctx.scale(20,20)

        // 20 height
        // 12 wide
        this.arena        = self.createMatrix(12,20)
        this.lastTime     = 0
        this.dropCounter  = 0
        this.dropInterval = 1000

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

        this.player = {pos:{},matrix:"",score:0}
        this.scoreEl = document.getElementById('score')

        // init player
        self.playerReset()
        self.init()
        self.update()
        self.updateScore()
    }

    init() {
        var self = this
        document.addEventListener('keydown', e => {
            switch ( e.keyCode ) {
                case 37: // left
                    self.playerMove(-1)
                break;

                case 39: // right
                    self.playerMove(1)
                break;

                case 40: // down
                    self.playerDrop()
                break;

                case 32: // space
                    self.playerQuickDrop()
                break;

                case 81: // w
                    self.playerRotate(-1)
                break;

                case 87: // q
                    self.playerRotate(1)
                break;
            }
        })
    }

    createPiece(type) {
        switch (type) {
            case "T":
                return  [
                [0,0,0],
                [1,1,1],
                [0,1,0],
            ]
            break;
            case "O":
                return  [
                [2,2],
                [2,2],
            ]
            break;
            case "L":
                return  [
                [0,3,0],
                [0,3,0],
                [0,3,3],
            ]
            break;
            case "J":
                return  [
                [0,4,0],
                [0,4,0],
                [4,4,0],
            ]
            break;
            case "I":
                return  [
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
            ]
            break;
            case "S":
                return  [
                [0,6,6],
                [6,6,0],
                [0,0,0],
            ]
            break;
            case "Z":
                return  [
                [7,7,0],
                [0,7,7],
                [0,0,0],
            ]
            break;

        }
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

    playerMove(dir) {
        var {collide,player,arena} = this
        player.pos.x += dir
        if (collide(arena, player)) {
            player.pos.x -= dir
        }
    }

    playerDrop() {
        var self = this
        self.player.pos.y++;
        //console.log(player.pos)
        if (self.collide(self.arena,self.player)) {
            // move player up
            self.player.pos.y--

                // merge the arena and player
                self.merge(self.arena,self.player)
            self.playerReset()
            self.arenaSweep()

            // restart from top
            self.player.pos.y=0
        }
        self.dropCounter = 0
    }

    playerQuickDrop() {
        var self = this
        while ( !self.collide(self.arena,self.player) ) {
            self.player.pos.y++;
        }

        if ( self.collide(self.arena,self.player) ) {
            // move player up
            self.player.pos.y--

            // merge the arena and player
            self.merge(self.arena,self.player)
            self.playerReset()
            self.arenaSweep()

            // restart from top
            self.player.pos.y=0
        }

        // reset 
        self.dropCounter  = 0
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

    update(time=0) {
        var self=this
        const deltaTime = time - self.lastTime
        self.lastTime = time

        self.dropCounter += deltaTime
        if(self.dropCounter > self.dropInterval) {
            self.playerDrop()
        }

        self.draw(self.player)
        requestAnimationFrame(self.update.bind(this))
    }

    draw(player) {
        var self=this
        self.ctx.fillStyle = '#000'
        self.ctx.fillRect(0,0, self.canvas.width, self.canvas.height)
        self.ctx.quadraticCurveTo (90, 10, 90, 20)

        self.drawMatrix(self.arena,{x:0,y:0})
        self.drawMatrix(self.player.matrix, self.player.pos)
    }

    drawMatrix(matrix, offset) {
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

    playerRotate(dir) {
        var self=this
        const pos=self.player.pos.x
        let offset=1
        self.rotate(self.player.matrix, dir)
        while(self.collide(self.arena, self.player)) {
            self.player.pos.x += offset
            offset = -(offset + ( offset > 0 ? 1 : -1 ));
            if (offset > self.player.matrix[0].length) {
                self.rotate(self.player.matrix, -dir)
                player.pos.x = pos
                return
            }
        }
    }

    rotate(matrix,dir){
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

    playerReset() {
        var self=this
        const pieces = "ILJOTSZ"
        // randomize player piece
        self.player.matrix = self.createPiece(pieces[ pieces.length * Math.random() | 0 ])

        self.player.pos.y = 0
        self.player.pos.x = ( self.arena[0].length / 2 | 0 ) - ( self.player.matrix[0].length / 2 | 0 )

        // when it is full
        if (self.collide(self.arena, self.player)) {
            self.arena.forEach( row => row.fill(0) )
            self.player.score = 0
            self.updateScore()
        }
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

    createMatrix(w,h) {
        const matrix = []
        while (h--) {
            matrix.push(new Array(w).fill(0))
        }
        return matrix
    }
}

new Tetris()

