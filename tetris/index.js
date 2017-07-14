const canvas = document.getElementById("tetris")
const ctx = canvas.getContext('2d')

ctx.scale(20,20)

const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
]

// merge(arena,player)
// console.log(arena)

// 20 height
// 12 wide
let arena = createMatrix(12,20)
// console.table(arena)
let player = {
    pos : {x:5, y:2},
    matrix : matrix
}

let lastTime     = 0
let dropCounter  = 0
let dropInterval = 1000

function createMatrix(w,h) {
    const matrix = []
    while (h--) {
        matrix.push(new Array(w).fill(0))
    }
    return matrix
}

function draw(player) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0, canvas.width, canvas.height)

    drawMatrix(arena,{x:0,y:0})
    drawMatrix(player.matrix, player.pos)
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row,y) => {
        row.forEach((value, x) => {
            if (value !==0) {
                ctx.fillStyle = 'red'
                ctx.fillRect(x + offset.x, y + offset.y ,1,1)
            }
        }) 
    })
}

function collide(arena, player) {
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

// this to trap the matrix within the arena
function merge(arena, player) {
    player.matrix.forEach((row,y)=>{
        row.forEach( (value, x) => {
            if (value !==0) {
                arena[y+player.pos.y][x+player.pos.x] = value
            }
        })
    })
}


function update(time=0) {
    const deltaTime = time - lastTime
           lastTime = time

    dropCounter += deltaTime
    if(dropCounter > dropInterval) {
        playerDrop()
    }

    draw(player)
    requestAnimationFrame(update)
}

function playerDrop() {
    player.pos.y++
        //console.log(player.pos)
    if (collide(arena,player)) {
        // move player up
        player.pos.y--

        // merge the arena and player
        merge(arena,player)

        // restart from top
        player.pos.y=0
    }
    dropCounter = 0
}

function playerMove(dir) {
    player.pos.x += dir
    if (collide(arena, player)) {
        player.pos.x -= dir
    }
}

function playerRotate(dir) {
    rotate(player.matrix, dir)
}

function rotate(matrix,dir){
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

document.addEventListener('keydown', e => {
    if(e.keyCode === 37) {
        playerMove(-1)
    }
    if(e.keyCode === 39) {
        playerMove(1)
    }
    if(e.keyCode === 40) {
        playerDrop()
    }
    // w
    if(e.keyCode === 81) {
        playerRotate(-1)
    }
    // q
    if(e.keyCode === 87) {
        playerRotate(1)
    }
    
})

update()

