const canvas = document.getElementById("tetris")
const ctx = canvas.getContext('2d')

ctx.scale(20,20)


const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
]

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

const player = {
    pos : {x:5, y:2},
    matrix : matrix
}

function update(time=0) {
    // console.log(time)
    draw(player)
    requestAnimationFrame(update)
}

draw(player)
update()

