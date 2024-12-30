const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startGameBtn = document.getElementById('startGameBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameOverDiv = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const finalScoreDisplay = document.getElementById('finalScore');
const playerNameInput = document.getElementById('playerName');
const titleScreen = document.querySelector('.title-screen');
const gridSize = 20;
const canvasSize = 400;

let snake = [{ x: 200, y: 200 }];
let food = {};
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let direction = 'RIGHT';
let gameInterval;
let backgroundInterval;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

function drawSnake() {
    ctx.fillStyle = 'limegreen';
    ctx.strokeStyle = 'darkgreen';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI*2 );
    ctx.fill();
}

function moveSnake() {
    const head = { ...snake[0] };
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'RIGHT') head.x += gridSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++
      
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    moveSnake();
    drawSnake();
    drawFood();

    if (checkCollision()) {
        clearInterval(gameInterval);
        endGame();
    }

    // Change the background color gradually based on movement
    updateBackgroundColor();
}

function updateBackgroundColor() {
    // Gradually change the background color with each game tick
    const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;  // Random color with full saturation
    document.body.style.backgroundColor = randomColor;
}

function startGame() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }

    score = 0;
    snake = [{ x: 200, y: 200 }];
    direction = 'LEFT';
    generateFood();

    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
    titleScreen.classList.remove('active');
    gameOverDiv.classList.remove('active');

    // Slow the snake down by increasing the interval time (400ms)
    gameInterval = setInterval(gameLoop, 300);
}

function endGame() {
    finalScoreDisplay.textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    gameOverDiv.classList.add('active');
    
}

function resetGame() {
    clearInterval(gameInterval);
    startGame();
}

// Event Listeners
startGameBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetGame);
window.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});
