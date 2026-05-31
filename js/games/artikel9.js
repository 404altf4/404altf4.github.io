const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("nextCanvas");
const nextCtx = nextCanvas.getContext("2d");

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const bestDisplay = document.getElementById("bestScore");

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
let board = [];
let currentPiece, nextPiece;
let score = 0;
let level = 0;
let speed = 500;
let playing = false;
let gameInterval;
let bestScore = localStorage.getItem("bestScore") || 0;
bestDisplay.textContent = "Best Skor: " + bestScore;

function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomColor() {
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomPiece() {
  const shapes = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[1,1,0],[0,1,1]], // S
    [[0,1,1],[1,1,0]]  // Z
  ];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return { shape, color: randomColor(), x: 3, y: 0 };
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = cell;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
}

function drawPiece(piece, context = ctx, offsetX = 0, offsetY = 0) {
  piece.shape.forEach((row, dy) => {
    row.forEach((val, dx) => {
      if (val) {
        context.fillStyle = piece.color;
        context.fillRect((piece.x + dx + offsetX) * BLOCK_SIZE, (piece.y + dy + offsetY) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeStyle = "#000";
        context.strokeRect((piece.x + dx + offsetX) * BLOCK_SIZE, (piece.y + dy + offsetY) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
}

function drawNextPiece() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  let preview = { ...nextPiece, x: 1, y: 1 };
  drawPiece(preview, nextCtx, 0, 0);
}

function mergePiece() {
  currentPiece.shape.forEach((row, dy) => {
    row.forEach((val, dx) => {
      if (val) {
        board[currentPiece.y + dy][currentPiece.x + dx] = currentPiece.color;
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;
  board = board.filter(row => {
    if (row.every(cell => cell)) {
      linesCleared++;
      return false;
    }
    return true;
  });
  while (board.length < ROWS) board.unshift(Array(COLS).fill(null));

  if (linesCleared > 0) {
    score += linesCleared * 10;
    scoreDisplay.textContent = "Skor: " + score;

    if (score % 10 === 0) {
      console.log("Pencapaian: 10 skor!");
    }

    if (score % 100 === 0) {
      level++;
      levelDisplay.textContent = "Level: " + level;
      if (speed > 100) {
        clearInterval(gameInterval);
        speed -= 50;
        gameInterval = setInterval(update, speed);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
      bestDisplay.textContent = "Best Skor: " + bestScore;
    }
  }
}

function collide(piece) {
  return piece.shape.some((row, dy) =>
    row.some((val, dx) => {
      if (!val) return false;
      const x = piece.x + dx;
      const y = piece.y + dy;
      return (
        y >= ROWS ||
        x < 0 ||
        x >= COLS ||
        (board[y] && board[y][x])
      );
    })
  );
}

function update() {
  currentPiece.y++;
  if (collide(currentPiece)) {
    currentPiece.y--;
    mergePiece();
    clearLines();
    currentPiece = nextPiece;
    nextPiece = randomPiece();
    drawNextPiece();
    if (collide(currentPiece)) {
      alert("Game Over! Skor kamu: " + score);
      clearInterval(gameInterval);
      playing = false;
      restartBtn.style.display = "inline-block";
    }
  }
  drawBoard();
  drawPiece(currentPiece);
}

playBtn.addEventListener("click", () => {
  if (!playing) {
    playing = true;
    score = 0;
    level = 0;
    speed = 500;
    createBoard();
    currentPiece = randomPiece();
    nextPiece = randomPiece();
    drawNextPiece();
    gameInterval = setInterval(update, speed);
    scoreDisplay.textContent = "Skor: 0";
    levelDisplay.textContent = "Level: 0";
    restartBtn.style.display = "none";
  }
});

restartBtn.addEventListener("click", () => {
  playing = false;
  clearInterval(gameInterval);
  playBtn.click();
});

document.addEventListener("keydown", e => {
  if (!playing) return;
  let oldX = currentPiece.x;
  let oldY = currentPiece.y;
  let oldShape = currentPiece.shape.map(r => [...r]);

  if (e.key === "ArrowLeft") currentPiece.x--;
  if (e.key === "ArrowRight") currentPiece.x++;
  if (e.key === "ArrowDown") currentPiece.y++;
  if (e.key === "ArrowUp") {
    currentPiece.shape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
  }

  if (collide(currentPiece)) {
    currentPiece.x = oldX;
    currentPiece.y = oldY;
    currentPiece.shape = oldShape;
  }

  drawBoard();
  drawPiece(currentPiece);
});
