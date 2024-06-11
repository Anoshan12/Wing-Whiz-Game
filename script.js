const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playAgainButton = document.getElementById('playAgain');

// Load background image
const bgImage = new Image();
bgImage.src = 'A.jpg'; // Ensure the image 'A.jpg' is in the same directory as this script

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    draw: function() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    flap: function() {
        this.velocity = this.lift;
    }
};

const pipes = [];
const pipeWidth = 30;
const pipeGap = 250;
let frameCount = 0;
let isGameOver = false;
let pipeCount = 0;

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (frameCount % 75 === 0) {
        const isSmallPipe = pipeCount < 5;
        const maxPipeHeight = isSmallPipe ? (canvas.height - pipeGap) / 2 : canvas.height - pipeGap;
        const top = Math.random() * maxPipeHeight;
        const bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top: top, bottom: bottom });
        pipeCount++;
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }
}

function detectCollision() {
    for (const pipe of pipes) {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver();
        }
    }
}

function gameOver() {
    isGameOver = true;
    ctx.font = '48px serif';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', 50, canvas.height / 2);
    playAgainButton.style.display = 'block';
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frameCount = 0;
    pipeCount = 0;
    isGameOver = false;
    playAgainButton.style.display = 'none';
    gameLoop();
} 

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isGameOver) {
        bird.flap();
    }
});

function drawFooterText() {
    ctx.font = '10px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Made by Anoshan', 10, canvas.height - 10);
}

function gameLoop() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        bird.update();
        bird.draw();

        updatePipes();
        drawPipes();

        detectCollision();

        drawFooterText();

        frameCount++;
        requestAnimationFrame(gameLoop);
    }
}

bgImage.onload = function() {
    gameLoop();
};
