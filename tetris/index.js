const canvas = document.getElementById("tetris")
const ctx = canvas.getContext('2d')

ctx.scale(20,20)

ctx.fillStyle = '#000'
ctx.fillRect(0,0, canvas.width, canvas.height)

const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
]

function draw(player) {
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

const player = {
    pos : {x:5, y:2},
    matrix : matrix
}

draw(player)

