// Game constants
const GRID_SIZE = 20;
const TILE_COUNT = 20;

// Game variables
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameSpeed = 120; // milliseconds
let gameRunning = false;
let gameLoop;

// DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const gameOverElement = document.getElementById('game-over');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');

// Initialize game
function initGame() {
    // Initialize snake
    snake = [
        {x: 10, y: 10}, // head
        {x: 9, y: 10},
        {x: 8, y: 10}  // tail
    ];
    
    // Place first food
    placeFood();
    
    // Reset game state
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 120;
    
    // Hide game over screen
    gameOverElement.classList.add('hidden');
}

// Place food at random location
function placeFood() {
    food = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
    };
    
    // Make sure food doesn't appear on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
            break;
        }
    }
}

// Main game loop
function runGame() {
    if (!gameRunning) return;
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position based on direction
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // Check for collision with walls
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        gameOver();
        return;
    }
    
    // Check for collision with self
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
            return;
        }
    }
    
    // Add new head to snake
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        scoreElement.textContent = score;
        
        // Place new food
        placeFood();
        
        // Increase speed slightly every 50 points
        if (score % 50 === 0 && gameSpeed > 60) {
            gameSpeed -= 5;
        }
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Draw everything
    draw();
    
    // Continue game loop
    setTimeout(runGame, gameSpeed);
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head differently
            ctx.fillStyle = '#2e7d32';
        } else {
            // Draw body
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(
            segment.x * GRID_SIZE, 
            segment.y * GRID_SIZE, 
            GRID_SIZE - 1, 
            GRID_SIZE - 1
        );
    });
    
    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.fillRect(
        food.x * GRID_SIZE, 
        food.y * GRID_SIZE, 
        GRID_SIZE - 1, 
        GRID_SIZE - 1
    );
}

// Game over function
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    runGame();
}

// Reset game
function resetGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    initGame();
    draw();
}

// Event listeners for buttons
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', resetGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    // Prevent direction reversal
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// Initialize the game
initGame();
draw();