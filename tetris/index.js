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

matrix.forEach((row,y) => {
    row.forEach((value, x) => {
        if (value !==0) {
            ctx.fillStyle = 'red'
            ctx.fillRect(x,y,1,1)
        }
    }) 
})

