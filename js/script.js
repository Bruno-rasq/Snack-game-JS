const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// ctx.fillStyle = "green"
// ctx.fillRect(300, 200, 50, 50)

const size = 30

const snack = [
    { x: 200, y: 200 },
    { x: 230, y: 200 },
]

let direction;



const drawSnack = () => {
    ctx.fillStyle = '#2B3499'

    // ctx.fillRect(snack[0].x, snack[0].y, size, size)
    snack.forEach((position, index) => {

        //distinguindo a cor da cabeça
        if(index === snack.length - 1){
            ctx.fillStyle = '#4d59da'
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnack = () => {

    if(!direction) return 

    const head = snack[snack.length - 1] 

    if(direction === 'right'){
        snack.push({ x: head.x + size, y: head.y })
    }

    if(direction === 'left'){
        snack.push({ x: head.x - size, y: head.y })
    }

    if(direction === 'down'){
        snack.push({ x: head.x, y: head.y + size})
    }

    if(direction === 'up'){
        snack.push({ x: head.x, y: head.y - size })
    }

    snack.shift()
}


setInterval(() => {

    ctx.clearRect(0, 0, 600, 600)
    
    moveSnack()
    drawSnack()
}, 300)