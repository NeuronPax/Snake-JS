const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height
const blockSize = 15
const widthInBlocks = width / blockSize
const heightInBlocks = height / blockSize
let score = 0
const directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
}
const drawBorder = () => {
    ctx.fillStyle = 'grey'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'lightgrey'
    ctx.fillRect(blockSize, blockSize, width - blockSize * 2, height - blockSize * 2)
}
const drawText = (txt, txtSize, txtAlign, txtBaseline, x, y) => {
    ctx.font = `${txtSize}px Courier`
    ctx.fillStyle = 'black'
    ctx.textAlign = txtAlign
    ctx.textBaseline = txtBaseline
    ctx.fillText(txt, x, y)
}
const Block = function(col, row) {
    this.col = col
    this.row = row
}
Block.prototype.drawSquare = function(color) {
    ctx.fillStyle = color
    ctx.fillRect(this.col * blockSize, this.row * blockSize, blockSize, blockSize)
    ctx.strokeStyle = 'lightgrey'
    ctx.strokeRect(this.col * blockSize, this.row * blockSize, blockSize, blockSize)
}
Block.prototype.drawCircle = function(color) {
    const radius = blockSize / 2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(this.col * blockSize + radius, this.row * blockSize + radius, radius, 0, Math.PI * 2)
    ctx.fill()
}
Block.prototype.equal = function(block) {
    return this.col === block.col && this.row === block.row
}
const Snake = function() {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ]
    this.direction = 'right'
    this.nextDirection = 'right'
}
Snake.prototype.draw = function() {
    this.segments.forEach(segment => segment.drawSquare('blue'))
}
Snake.prototype.chk = function(head) {
    const wallChk = head.col === 0 || head.row === 0 || head.col === widthInBlocks - 1 || head.row === heightInBlocks - 1
    let selfChk = false
    this.segments.forEach(segment => head.equal(segment) ? selfChk = true : null)
    return wallChk || selfChk
}
Snake.prototype.move = function() {
    const head = this.segments[0]
    let newHead
    this.direction = this.nextDirection
    this.direction === 'left' ? newHead = new Block(head.col - 1, head.row) :
    this.direction === 'up' ? newHead = new Block(head.col, head.row - 1) :
    this.direction === 'right' ? newHead = new Block(head.col + 1, head.row) :
    this.direction === 'down' ? newHead = new Block(head.col, head.row + 1) : null
    if (this.chk(newHead)) {
        clearInterval(intervalId)
        drawText('Конец игры!', 80, 'center', 'middle', width / 2, height / 2)
        return
    }
    this.segments.unshift(newHead)
    if (newHead.equal(apple.position)) {
        score++
        apple.move()
    } else this.segments.pop()
}
Snake.prototype.setDirection = function(newDirection) {
    if (this.direction === 'left' && newDirection === 'right') return
    if (this.direction === 'right' && newDirection === 'left') return
    if (this.direction === 'up' && newDirection === 'down') return
    if (this.direction === 'down' && newDirection === 'up') return
    this.nextDirection = newDirection
}
const Apple = function() {
    this.position = new Block(10, 10)
}
Apple.prototype.draw = function() {
    this.position.drawCircle('tomato')
}
Apple.prototype.move = function() {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1
    this.position = new Block(randomCol, randomRow)
}
document.addEventListener('keydown', e => {
    const newDirection = directions[e.keyCode]
    newDirection !== undefined ? snake.setDirection(newDirection) : null
})
let snake = new Snake()
let apple = new Apple()
const intervalId = setInterval(() => {
    drawBorder()
    drawText(`Счёт: ${score}`, 30, 'left', 'top', blockSize, blockSize)
    snake.move()
    snake.draw()
    apple.draw()
}, 70)