const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");

// Kontrol Navigasi Immersive Mobile
const gameZone = document.getElementById("game-zone");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const exitBtn = document.getElementById("exitBtn");

const joystickContainer = document.getElementById("joystick-container");
const joystickBase = document.getElementById("joystick-base");
const joystickStick = document.getElementById("joystick-stick");

// ==========================================
// PENGATURAN AWAL ENGINE GAME
// ==========================================
let baseSpeedBlue = 1.5;
let baseSpeedRed = 1.0;
let invincible = false;

let player = { x: 50, y: 50, size: 40, color: "lime", speed: 5 };
let scoreEnemy = { x: 200, y: 150, size: 30, color: "blue", speed: baseSpeedBlue, dirX: 1, dirY: 1 };
let dangerEnemies = [{ x: 400, y: 250, size: 40, color: "red", speed: baseSpeedRed, dirX: -1, dirY: 1 }];

// Sistem Bonus Kotak Kuning (+3 Skor)
let bonusItem = { x: 0, y: 0, size: 25, color: "yellow", active: false };
let bonusTimerId = null; 

let score = 0;
let level = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let gameOver = false;
let isRunning = false;

// Input Controls
let keys = {};
let joystickX = 0; // Menyimpan nilai vektor X (-1 hingga 1)
let joystickY = 0; // Menyimpan nilai vektor Y (-1 hingga 1)

// ==========================================
// KONTROL MULTI-INPUT (KEYBOARD WINDOWS & PC)
// ==========================================
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (gameOver && e.key.toLowerCase() === "r") {
    triggerRestart();
  }
});
document.addEventListener("keyup", e => keys[e.key] = false);

// ==========================================
// KONTROL ANALOG JOYSTICK 360° SMOOTH (MOBILE)
// ==========================================
let startX = 0, startY = 0;
let joystickActive = false;
const maxRadius = 40; 

window.addEventListener("touchstart", e => {
  // Joystick dapat diakses di mana saja termasuk di dalam area canvas game
  if (e.target.tagName === "BUTTON" || gameOver || !isRunning) return;
  
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  joystickActive = true;

  joystickContainer.style.display = "block";
  joystickContainer.style.left = `${startX - 60}px`;
  joystickContainer.style.top = `${startY - 60}px`;

  joystickStick.style.left = "50%";
  joystickStick.style.top = "50%";
});

window.addEventListener("touchmove", e => {
  if (!joystickActive) return;
  
  const touch = e.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX);

  let stickX = deltaX;
  let stickY = deltaY;

  // Batasi pergerakan visual stick agar tidak keluar dari area base analog
  if (distance > maxRadius) {
    stickX = Math.cos(angle) * maxRadius;
    stickY = Math.sin(angle) * maxRadius;
  }

  joystickStick.style.left = `${50 + stickX}px`;
  joystickStick.style.top = `${50 + stickY}px`;

  // Kalkulasi kekuatan arah presisi linear (0 sampai 1) untuk pergerakan halus 360°
  const intensity = Math.min(distance / maxRadius, 1); 
  joystickX = Math.cos(angle) * intensity;
  joystickY = Math.sin(angle) * intensity;

}, { passive: false });

window.addEventListener("touchend", () => {
  if (!joystickActive) return;
  joystickActive = false;
  joystickContainer.style.display = "none";

  // Reset vektor ke 0 agar karakter langsung berhenti seketika saat dilepas
  joystickX = 0;
  joystickY = 0;
  
  keys["ArrowLeft"] = false;
  keys["ArrowRight"] = false;
  keys["ArrowUp"] = false;
  keys["ArrowDown"] = false;
});

window.addEventListener("touchmove", e => {
  if (isRunning) e.preventDefault();
}, { passive: false });

// ==========================================
// FITUR INTERAKTIF FULLSCREEN & EXIT (MOBILE)
// ==========================================
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    gameZone.requestFullscreen().then(() => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(() => {});
      }
    }).catch(err => {
      alert(`Gagal mengaktifkan Immersive Mode: ${err.message}`);
    });
    fullscreenBtn.innerText = "✕ Normal Screen";
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullscreenBtn.innerText = "⛶ Fullscreen";
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  }
});

exitBtn.addEventListener("click", () => {
  if (confirm("Apakah kamu ingin keluar ke halaman utama?")) {
    window.location.reload(); 
  }
});

// ==========================================
// LOGIKA ENGINE UTAMA GAME
// ==========================================
function update() {
  if (gameOver) return;

  // 1. SISTEM PERGERAKAN PLAYER (HYBRID: KEYBOARD & ANALOG VEKTOR)
  if (joystickActive) {
    // Pergerakan super halus berdasarkan arah tarikan joystick di HP
    player.x += joystickX * player.speed;
    player.y += joystickY * player.speed;
  } else {
    // Pergerakan standar jika menggunakan Keyboard di PC/Windows
    let moveX = 0;
    let moveY = 0;

    if (keys["ArrowUp"] || keys["w"]) moveY = -1;
    if (keys["ArrowDown"] || keys["s"]) moveY = 1;
    if (keys["ArrowLeft"] || keys["a"]) moveX = -1;
    if (keys["ArrowRight"] || keys["d"]) moveX = 1;

    // Normalisasi kecepatan diagonal agar tidak terlalu cepat saat berjalan serong
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    player.x += moveX * player.speed;
    player.y += moveY * player.speed;
  }

  // Batasan dinding canvas agar player tidak tembus keluar layar
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
  if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

  // Pergerakan Musuh Skor (Biru)
  scoreEnemy.x += scoreEnemy.speed * scoreEnemy.dirX;
  scoreEnemy.y += scoreEnemy.speed * scoreEnemy.dirY;
  if (scoreEnemy.x <= 0 || scoreEnemy.x + scoreEnemy.size >= canvas.width) scoreEnemy.dirX *= -1;
  if (scoreEnemy.y <= 0 || scoreEnemy.y + scoreEnemy.size >= canvas.height) scoreEnemy.dirY *= -1;

  // Pergerakan Musuh Bahaya (Merah)
  dangerEnemies.forEach(enemy => {
    enemy.x += enemy.speed * enemy.dirX;
    enemy.y += enemy.speed * enemy.dirY;
    if (enemy.x <= 0 || enemy.x + enemy.size >= canvas.width) enemy.dirX *= -1;
    if (enemy.y <= 0 || enemy.y + enemy.size >= canvas.height) enemy.dirY *= -1;
  });

  // Logika Tabrakan Player dengan Musuh Biru (Skor +1)
  if (player.x < scoreEnemy.x + scoreEnemy.size &&
      player.x + player.size > scoreEnemy.x &&
      player.y < scoreEnemy.y + scoreEnemy.size &&
      player.y + player.size > scoreEnemy.y) {
    
    score++;

    // Bonus Kotak Kuning muncul setiap kelipatan skor 5
    if (score > 0 && score % 5 === 0) {
      if (bonusTimerId) clearTimeout(bonusTimerId);

      bonusItem.x = Math.random() * (canvas.width - bonusItem.size);
      bonusItem.y = Math.random() * (canvas.height - bonusItem.size);
      bonusItem.active = true;

      // Timer 2 Detik: Kotak kuning otomatis lenyap jika tidak sempat diambil
      bonusTimerId = setTimeout(() => {
        bonusItem.active = false;
      }, 2000);
    }

    scoreEnemy.x = Math.random() * (canvas.width - scoreEnemy.size);
    scoreEnemy.y = Math.random() * (canvas.height - scoreEnemy.size);

    // Sistem Leveling Game
    let newLevel = Math.floor(score / 10);
    if (newLevel > level) {
      level = newLevel;
      scoreEnemy.speed = baseSpeedBlue + level * 0.2;
      dangerEnemies.forEach(enemy => enemy.speed = baseSpeedRed + level * 0.2);

      let targetRedEnemies = Math.floor(level / 10) + 1;
      while (dangerEnemies.length < targetRedEnemies) {
        dangerEnemies.push({
          x: Math.random() * (canvas.width - 40),
          y: Math.random() * (canvas.height - 40),
          size: 40,
          color: "red",
          speed: baseSpeedRed + level * 0.2,
          dirX: Math.random() < 0.5 ? 1 : -1,
          dirY: Math.random() < 0.5 ? 1 : -1
        });
      }
    }
  }

  // Logika Tabrakan Player dengan Kotak Kuning Bonus (Skor +3)
  if (bonusItem.active &&
      player.x < bonusItem.x + bonusItem.size &&
      player.x + player.size > bonusItem.x &&
      player.y < bonusItem.y + bonusItem.size &&
      player.y + player.size > bonusItem.y) {
    
    score += 3; 
    bonusItem.active = false; 

    if (bonusTimerId) {
      clearTimeout(bonusTimerId);
      bonusTimerId = null;
    }
  }

  // Logika Tabrakan Player dengan Musuh Merah (Game Over)
  if (!invincible) {
    dangerEnemies.forEach(enemy => {
      if (player.x < enemy.x + enemy.size &&
          player.x + player.size > enemy.x &&
          player.y < enemy.y + enemy.size &&
          player.y + player.size > enemy.y) {
        
        gameOver = true;
        isRunning = false;
        restartBtn.style.display = "inline-block"; 
        
        if (bonusTimerId) clearTimeout(bonusTimerId);

        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
        }
      }
    });
  }
}

// ==========================================
// RENDER GRAFIS (DRAWING ENGINE)
// ==========================================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar Player (Hijau)
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Gambar Target Musuh (Biru)
  ctx.fillStyle = scoreEnemy.color;
  ctx.fillRect(scoreEnemy.x, scoreEnemy.y, scoreEnemy.size, scoreEnemy.size);

  // Gambar Kotak Bonus (Kuning) jika sedang aktif
  if (bonusItem.active) {
    ctx.fillStyle = bonusItem.color;
    ctx.fillRect(bonusItem.x, bonusItem.y, bonusItem.size, bonusItem.size);
  }

  // Gambar Semua Rintangan (Merah)
  dangerEnemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });

  // Teks Tampilan Game Over
  if (gameOver) {
    ctx.fillStyle = "yellow";
    ctx.font = "bold 30px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 95, canvas.height / 2);
    ctx.font = "16px Arial";
    ctx.fillText("Tekan R atau tombol Restart", canvas.width / 2 - 105, canvas.height / 2 + 40);
  }
}

function updateHUD() {
  document.getElementById("score").innerText = "Skor: " + score;
  document.getElementById("level").innerText = "Level: " + level;
  document.getElementById("bestScore").innerText = "Best Skor: " + bestScore;
}

function restartGame() {
  score = 0;
  level = 0;
  gameOver = false;
  invincible = false;
  player.x = 50;
  player.y = 50;
  scoreEnemy.speed = baseSpeedBlue;
  dangerEnemies = [{ x: 400, y: 250, size: 40, color: "red", speed: baseSpeedRed, dirX: -1, dirY: 1 }];
  
  bonusItem.active = false; 
  if (bonusTimerId) {
    clearTimeout(bonusTimerId);
    bonusTimerId = null;
  }
  
  restartBtn.style.display = "none";
}

function triggerRestart() {
  restartGame();
  if (!isRunning) {
    isRunning = true;
    gameLoop();
  }
}

function gameLoop() {
  update();
  draw();
  updateHUD();
  if (isRunning) requestAnimationFrame(gameLoop);
}

// ==========================================
// INISIALISASI EVENT LISTENER BUTTONS
// ==========================================
playBtn.addEventListener("click", () => {
  if (!isRunning) {
    if (gameOver) restartGame();
    isRunning = true;
    gameLoop();
    playBtn.style.display = "none"; 
  }
});

restartBtn.addEventListener("click", () => {
  triggerRestart();
});

document.getElementById("bestScore").innerText = "Best Skor: " + bestScore;