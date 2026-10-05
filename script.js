const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");
const lengthElement = document.getElementById("length");
const speedElement = document.getElementById("speed");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const restartBtn = document.getElementById("restartBtn");

const finalScoreElement = document.getElementById("finalScore");

const GRID = 20;

let cellSize;

let snake;

let food;

let direction;

let nextDirection;

let score = 0;

let bestScore =
    Number(localStorage.getItem("snakeRushBest")) || 0;

let gameRunning = false;

let gameTimer;

let speed = 1;

let moveDelay = 150;




function resizeCanvas() {

    const size = Math.min(
        canvas.parentElement.clientWidth,
        650
    );

    canvas.width = size;
    canvas.height = size;

    cellSize = canvas.width / GRID;

    draw();
}



function startGame() {

    clearInterval(gameTimer);

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    score = 0;

    speed = 1;

    moveDelay = 150;

    gameRunning = true;

    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    updateStats();

    createFood();

    gameTimer = setInterval(
        gameLoop,
        moveDelay
    );

    draw();
}



function gameLoop() {

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };




    if (
        head.x < 0 ||
        head.x >= GRID ||
        head.y < 0 ||
        head.y >= GRID
    ) {

        gameOver();

        return;
    }




    for (let i = 0; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            gameOver();

            return;
        }
    }


    snake.unshift(head);




    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score += 10;

        increaseSpeed();

        createFood();

    } else {

        snake.pop();
    }


    updateStats();

    draw();
}




function createFood() {

    let validPosition = false;

    while (!validPosition) {

        food = {
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID)
        };

        validPosition = !snake.some(
            segment =>
                segment.x === food.x &&
                segment.y === food.y
        );
    }
}



function increaseSpeed() {

    if (score % 50 === 0) {

        speed++;

        moveDelay = Math.max(
            65,
            moveDelay - 15
        );

        clearInterval(gameTimer);

        gameTimer = setInterval(
            gameLoop,
            moveDelay
        );
    }
}



function draw() {

    if (!cellSize) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawFood();

    drawSnake();
}




function drawFood() {

    const centerX =
        food.x * cellSize + cellSize / 2;

    const centerY =
        food.y * cellSize + cellSize / 2;

    const radius = cellSize * 0.3;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#f43f5e";

    ctx.fill();

    ctx.shadowColor = "#f43f5e";

    ctx.shadowBlur = 15;

    ctx.fill();

    ctx.shadowBlur = 0;



    ctx.beginPath();

    ctx.arc(
        centerX - 3,
        centerY - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();
}




function drawSnake() {

    snake.forEach((segment, index) => {

        const x =
            segment.x * cellSize;

        const y =
            segment.y * cellSize;

        const padding = 2;

        const size =
            cellSize - padding * 2;


        ctx.fillStyle =
            index === 0
                ? "#4ade80"
                : "#22c55e";


        ctx.beginPath();

        ctx.roundRect(
            x + padding,
            y + padding,
            size,
            size,
            6
        );

        ctx.fill();




        if (index === 0) {

            drawEyes(
                x,
                y
            );
        }
    });
}




function drawEyes(x, y) {

    ctx.fillStyle = "#07140b";

    const eyeSize = 3;

    let eye1;
    let eye2;


    if (direction.x === 1) {

        eye1 = {
            x: x + cellSize - 7,
            y: y + 6
        };

        eye2 = {
            x: x + cellSize - 7,
            y: y + cellSize - 6
        };

    } else if (direction.x === -1) {

        eye1 = {
            x: x + 7,
            y: y + 6
        };

        eye2 = {
            x: x + 7,
            y: y + cellSize - 6
        };

    } else if (direction.y === -1) {

        eye1 = {
            x: x + 6,
            y: y + 7
        };

        eye2 = {
            x: x + cellSize - 6,
            y: y + 7
        };

    } else {

        eye1 = {
            x: x + 6,
            y: y + cellSize - 7
        };

        eye2 = {
            x: x + cellSize - 6,
            y: y + cellSize - 7
        };
    }


    ctx.beginPath();

    ctx.arc(
        eye1.x,
        eye1.y,
        eyeSize,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2.x,
        eye2.y,
        eyeSize,
        0,
        Math.PI * 2
    );

    ctx.fill();
}




function changeDirection(newDirection) {

    if (!gameRunning) return;


    if (
        newDirection === "up" &&
        direction.y !== 1
    ) {

        nextDirection = {
            x: 0,
            y: -1
        };
    }


    if (
        newDirection === "down" &&
        direction.y !== -1
    ) {

        nextDirection = {
            x: 0,
            y: 1
        };
    }


    if (
        newDirection === "left" &&
        direction.x !== 1
    ) {

        nextDirection = {
            x: -1,
            y: 0
        };
    }


    if (
        newDirection === "right" &&
        direction.x !== -1
    ) {

        nextDirection = {
            x: 1,
            y: 0
        };
    }
}




document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        if (
            key === "arrowup" ||
            key === "w"
        ) {

            event.preventDefault();

            changeDirection("up");
        }


        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            event.preventDefault();

            changeDirection("down");
        }


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            event.preventDefault();

            changeDirection("left");
        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            event.preventDefault();

            changeDirection("right");
        }
    }
);



document
    .querySelectorAll(".mobile-controls button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeDirection(
                    button.dataset.direction
                );

            }
        );
    });




function gameOver() {

    gameRunning = false;

    clearInterval(gameTimer);

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "snakeRushBest",
            bestScore
        );
    }

    finalScoreElement.textContent = score;

    gameOverScreen.classList.remove(
        "hidden"
    );

    updateStats();
}



function updateStats() {

    scoreElement.textContent = score;

    bestElement.textContent = bestScore;

    lengthElement.textContent =
        snake ? snake.length : 3;

    speedElement.textContent = speed;
}




startBtn.addEventListener(
    "click",
    startGame
);

playAgainBtn.addEventListener(
    "click",
    startGame
);

restartBtn.addEventListener(
    "click",
    startGame
);



window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

bestElement.textContent = bestScore;