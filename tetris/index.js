const canvas = document.getElementById("tetris")
const ctx = canvas.getContext('2d')

ctx.scale(20,20)

const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
]

function createPiece(type) {
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
                [1,1],
                [1,1],
            ]
        break;
        case "L":
            return  [
                [0,1,0],
                [0,1,0],
                [0,1,1],
            ]
        break;
        case "J":
            return  [
                [0,1,0],
                [0,1,0],
                [1,1,0],
            ]
        break;
        case "I":
            return  [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
            ]
        break;
        case "S":
            return  [
                [0,1,1],
                [1,1,0],
                [0,0,0],
            ]
        break;
        case "Z":
            return  [
                [1,1,0],
                [0,1,1],
                [0,0,0],
            ]
        break;

    }
}

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
    const pos=player.pos.x
    let offset=1
    rotate(player.matrix, dir)
    while(collide(arena, player)) {
        player.pos.x += offset
        offset = -(offset + ( offset > 0 ? 1 : -1 ));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir)
            player.pos.x = pos
            return
        }
    }
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
    switch ( e.keyCode ) {
        case 37: // left
            playerMove(-1)
        break;
        case 39: // right
            playerMove(1)
        break;
        case 40: // down
            playerDrop()
        break;
        case 81: // w
            playerRotate(-1)
        break;
        case 87: // q
            playerRotate(1)
        break;
    }
})

update()

