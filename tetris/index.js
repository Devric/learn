const canvas = document.getElementById("tetris")
const ctx = canvas.getContext('2d')

ctx.scale(20,20)


const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
]

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

// merge(arena,player)
// console.log(arena)

// 20 height
// 12 wide
const arena = createMatrix(12,20)
// console.table(arena)
const player = {
    pos : {x:5, y:2},
    matrix : matrix
}

let lastTime     = 0
let dropCounter  = 0
let dropInterval = 1000
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
    dropCounter = 0
}

document.addEventListener('keydown', e => {
    console.log(e)
    if(e.keyCode === 37) {
        player.pos.x--
    }
    if(e.keyCode === 39) {
        player.pos.x++
    }
    if(e.keyCode === 40) {
        playerDrop()
    }
    
})

update()

