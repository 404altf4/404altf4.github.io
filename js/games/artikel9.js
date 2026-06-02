// ==========================================
// Inisialisasi Elemen Canvas & HUD
// ==========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("nextCanvas");
const nextCtx = nextCanvas.getContext("2d");

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const bestDisplay = document.getElementById("bestScore");

// ==========================================
// Pengaturan Dimensi Game
// ==========================================
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

// ==========================================
// Mekanik Game Dasar
// ==========================================
function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomColor() {
  const colors = ["#ff3333", "#33ff33", "#3333ff", "#ffff33", "#ff33ff", "#33ffff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomPiece() {
  const shapes = [
    [[1,1,1,1]],         // I
    [[1,1],[1,1]],       // O
    [[0,1,0],[1,1,1]],   // T
    [[1,1,0],[0,1,1]],   // S
    [[0,1,1],[1,1,0]]    // Z
  ];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return { shape, color: randomColor(), x: 3, y: 0 };
}

// ==========================================
// Rendering
// ==========================================
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) drawBlock(ctx, x, y, cell);
    });
  });
}

function drawBlock(context, x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  context.strokeStyle = "#000";
  context.lineWidth = 1.5;
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawPiece(piece, context = ctx, offsetX = 0, offsetY = 0) {
  piece.shape.forEach((row, dy) => {
    row.forEach((val, dx) => {
      if (val) {
        drawBlock(context, piece.x + dx + offsetX, piece.y + dy + offsetY, piece.color);
      }
    });
  });
}

function drawNextPiece() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  let preview = { ...nextPiece, x: 0, y: 0 };
  nextCtx.save();
  nextCtx.scale(0.8, 0.8);
  drawPiece(preview, nextCtx, 0.5, 0.5);
  nextCtx.restore();
}

// ==========================================
// Aturan Tabrakan & Line Clearing
// ==========================================
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

  while (board.length < ROWS) {
    board.unshift(Array(COLS).fill(null));
  }

  if (linesCleared > 0) {
    // Hitung skor + bonus
    let basePoints = linesCleared * 10;
    let bonus = (linesCleared > 1) ? (linesCleared - 1) * 5 : 0;
    score += basePoints + bonus;

    // Hitung level otomatis dari skor
    level = Math.floor(score / 100);

    // Update HUD
    scoreDisplay.textContent = "Skor: " + score;
    levelDisplay.textContent = "Level: " + level;

    // Update speed sesuai level
    if (speed > 150) {
      clearInterval(gameInterval);
      speed = 500 - (level * 50);
      if (speed < 150) speed = 150;
      gameInterval = setInterval(update, speed);
    }

    // Best score
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
      playBtn.style.display = "none";
    }
  }
  drawBoard();
  drawPiece(currentPiece);
}

// ==========================================
// Kontrol Menu
// ==========================================
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
  playBtn.style.display = "inline-block";
  playBtn.click();
});

// ==========================================
// Kontrol Gerakan
// ==========================================
function movePiece(dir) {
  if (!playing) return;

  let oldX = currentPiece.x;
  let oldY = currentPiece.y;
  let oldShape = currentPiece.shape.map(r => [...r]);

  if (dir === "left") currentPiece.x--;
  if (dir === "right") currentPiece.x++;
  if (dir === "down") currentPiece.y++;
  if (dir === "rotate") {
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
}

// Keyboard
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") movePiece("left");
  if (e.key === "ArrowRight") movePiece("right");
  if (e.key === "ArrowDown") movePiece("down");
  if (e.key === "ArrowUp") movePiece("rotate");
});

// Mobile
const bindMobileEvent = (id, action) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      movePiece(action);
    }, { passive: false });
  }
};

bindMobileEvent("leftBtn", "left");
bindMobileEvent("rightBtn", "right");
bindMobileEvent("downBtn", "down");
bindMobileEvent("rotateBtn", "rotate");
