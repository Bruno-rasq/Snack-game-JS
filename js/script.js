const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const song = new Audio('../assets/pixel.mp3')

const score = document.querySelector('.score--value')
const finalScore = document.querySelector('.final-score > span')

const menu = document.querySelector('.menu--screen')
const btn_play = document.querySelector('.btn--play')

const size = 30
const initialPosition = { x: 270, y: 240 }

let snack = [initialPosition]


const randonNumber = (min, max) => {

    return Math.round(Math.random() * (max - min) + min)
}

const randonPosition = () => {

    const number = randonNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randonColor = () => {

    const red = randonNumber(0, 255)
    const blue = randonNumber(0, 255)
    const green = randonNumber(0, 255)

    return `rgb(${red}, ${blue}, ${green})`
}

const food = {
    x: randonPosition(),
    y: randonPosition(),
    color: randonColor()
}

let direction, loopId
let speed = 300, initial_score = 0


const IncrementScore = () => {
    score.innerHTML = +score.innerHTML + 10
}

const drawSnack = () => {
    ctx.fillStyle = '#23a354'

    // ctx.fillRect(snack[0].x, snack[0].y, size, size)
    snack.forEach((position, index) => {

        //distinguindo a cor da cabeça
        if(index === snack.length - 1){
            ctx.fillStyle = '#2bd36b'
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

const drawGrid = () => {

    ctx.lineWidth = 1
    ctx.strokeStyle = '#302b25'

    for(let i = 30; i < canvas.width; i += 30){

        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
    
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
    
        ctx.stroke()
    }

}

const drawFood = () => {

    const { x, y, color } = food

    ctx.fillStyle = color
    ctx.shadowBlur = 5
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const moreSpeed = () => {

    if (speed >= 100){
        speed -= 10
    }
}

const checkEat = () => {

    const head = snack[snack.length - 1] 

    if(head.x == food.x && head.y == food.y){
        
        IncrementScore()
        moreSpeed()
        song.play()
        snack.push(head)

        let x = randonPosition()
        let y = randonPosition()

        while(snack.find((position) => position.x === x && position.y === y)){

            x = randonPosition()
            y = randonPosition()
        }
        
        food.x = x
        food.y = y
        food.color = randonColor()
    }

}

const checkCollision = () => {

    const head = snack[snack.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snack.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snack.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        gameOver()
    }
}

const highScore = (currentScore) => {

    let highScore = +localStorage.getItem('highscore');
    let score = +currentScore

    if(highScore < score){
        localStorage.setItem('highscore', score)
    }
}

const gameOver = () => {

    direction = undefined
    
    menu.style.display = 'flex'
    canvas.style.filter = 'blur(4px)'

    speed = 300

    highScore(score.innerHTML)

    let high_score = localStorage.getItem('highscore')
    finalScore.innerHTML = high_score
}

const gameLoop = () => {

    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)

    drawGrid()
    drawFood()
    moveSnack()
    drawSnack()
    checkEat()
    checkCollision()

    loopId = setInterval(() => {
        gameLoop()
    }, speed)
}

gameLoop()


document.addEventListener('keydown', ({ key }) => {
    
    if(key === 'ArrowRight' && direction != 'left'){
        direction = 'right'
    }

    if(key === 'ArrowLeft' && direction != 'right'){
        direction = 'left'
    }

    if(key === 'ArrowDown' && direction != 'up'){
        direction = 'down'
    }
    if(key === 'ArrowUp' && direction != 'down'){
        direction = 'up'
    }
    
})

btn_play.addEventListener('click', () => {

    score.innerHTML = '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'

    snack = [initialPosition]
})

window.addEventListener('load', () => {

    let high_score = localStorage.getItem('highscore')

    if(!high_score){
        localStorage.setItem('highscore', initial_score)
    }
})