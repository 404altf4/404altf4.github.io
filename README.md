# Satu Hari Cerita - Web Project

Website ini adalah proyek personal yang berisi **artikel, game, dan rumus** dengan tampilan terstruktur menggunakan **HTML, CSS, dan JavaScript**.  
Halaman utama menampilkan sejarah Windows, dengan navigasi ke kategori **Games** dan **Rumus**.

---

## Struktur Halaman
- `index.html` → Halaman utama (berisi artikel "Sejarah Windows").
- `menu.html` → Menu navigasi untuk semua artikel.
- `games.html` → Halaman kategori **Game**.
- `rumus.html` → Halaman kategori **Rumus**.
- `Konten/artikel1.html` s/d `artikel9.html` → Artikel individual dengan konten masing-masing.
- `posts.json` → Data JSON untuk daftar artikel.

---

## Struktur Folder

### 📂 CSS
- `style.css` → CSS utama untuk layout dan tampilan umum.
- `artikel1.css` s/d `artikel9.css` → CSS khusus untuk setiap artikel.
- `games.css` → CSS untuk halaman games.
- `rumus.css` → CSS untuk halaman rumus.

### 📂 js
- `index.js` → Script utama untuk halaman index.
- `artikel.js` → Script untuk artikel.
- `games/`
  - `artikel8.js`, `artikel9.js`, `games.js` → Script untuk halaman games.
- `rumus/`
  - `artikel5.js`, `artikel6.js`, `artikel7.js`, `rumus.js` → Script untuk halaman rumus.

### 📂 Images
- Berisi gambar pendukung (misalnya `windows.png` untuk artikel sejarah Windows).

### 📂 Konten
- `artikel2.html` s/d `artikel9.html` → Artikel tambahan.
- `posts.json` → Data artikel.
- `games.html`, `rumus.html`, `menu.html`, `index.html` → Halaman utama dan kategori.

---

## Fitur Utama
- **Navigasi**: Home, Games, Rumus, dan pencarian artikel.
- **Artikel**: Setiap artikel memiliki CSS khusus untuk tampilan unik.
- **Games**: Halaman khusus dengan kategori game (contoh: Tetris, Game 2D).
- **Rumus**: Halaman khusus dengan kategori rumus (contoh: Jajar Genjang, Persegi).
- **Popular Posts**: Sidebar menampilkan artikel populer.
- **Responsive Design**: Menggunakan CSS agar nyaman dibaca di berbagai perangkat.

---

## Cara Menjalankan
1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/satu-hari-cerita.git
