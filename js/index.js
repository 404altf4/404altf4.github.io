// ==========================================================================
// 1. Variabel Global
// ==========================================================================
let articles = [];         // Menyimpan semua data artikel asli dari posts.json
let currentData = [];      // Menyimpan data aktif (bisa artikel utuh atau hasil filter pencarian)
let currentPage = 1;       // Halaman yang sedang aktif saat ini
const postsPerPage = 4;    // Jumlah artikel yang tampil per halaman

// ==========================================================================
// 2. Inisialisasi: Load Data dari posts.json
// ==========================================================================
fetch("Konten/posts.json")
  .then(res => {
    if (!res.ok) throw new Error("Gagal mengambil data dari server");
    return res.json();
  })
  .then(data => {
    // Filter data yang tipenya benar-benar "artikel"
    articles = data.filter(post => post.type === "artikel");
    currentData = articles; // Default awal data aktif adalah semua artikel

    // Tampilkan data & tombol halaman pertama kali
    renderPagination(currentData);

    // Tampilkan daftar artikel populer (menggunakan semua data asli)
    renderPopular(data);
  })
  .catch(err => console.error("Gagal load posts.json:", err));

// ==========================================================================
// 3. Render Artikel Utama (Berdasarkan Potongan Halaman)
// ==========================================================================
function renderPosts(list) {
  const container = document.getElementById("post-list");
  if (!container) return; // Keamanan jika elemen tidak ditemukan di HTML
  
  container.innerHTML = "";

  // Jika tidak ada artikel ditemukan (misal saat mengetik pencarian asal)
  if (list.length === 0) {
    container.innerHTML = `<p class="empty-message" style="text-align:center; color:#888;">Artikel tidak ditemukan.</p>`;
    return;
  }

  list.forEach(post => {
    const article = document.createElement("article");
    article.className = "timeline";
    article.innerHTML = `
      <div style="display:flex; gap:15px; align-items:flex-start;">
        <img src="${post.image}" alt="${post.title}" class="post-thumb">
        <div>
          <a href="${post.link}" target="_blank">
            <h2>${post.title}</h2>
          </a>
          <p>${post.desc}</p>
        </div>
      </div>
    `;
    container.appendChild(article);
  });
}

// ==========================================
// KODE PAGINATION & EVENT TOMBOL (VERSI AMAN)
// ==========================================
function renderPagination(data) {
  const totalPages = Math.ceil(data.length / postsPerPage) || 1;

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // Potong data untuk ditampilkan
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  renderPosts(data.slice(start, end));

  // Render Angka (1, 2, 3)
  const pageNumbers = document.getElementById("pageNumbers");
  if (pageNumbers) {
    pageNumbers.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPagination(currentData);
      });
      pageNumbers.appendChild(btn);
    }
  }

  // KONTROL UTAMA TOMBOL PREV & NEXT
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) {
    // Atur tombol mati/aktif
    prevBtn.disabled = (currentPage === 1);
    
    // Hapus event listener lama agar tidak double klik, lalu pasang yang baru
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderPagination(currentData);
      }
    };
  }

  if (nextBtn) {
    // Atur tombol mati/aktif
    nextBtn.disabled = (currentPage === totalPages || data.length === 0);
    
    // Hapus event listener lama agar tidak double klik, lalu pasang yang baru
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPagination(currentData);
      }
    };
  }
}

// ==========================================================================
// 6. Fitur Pencarian (Real-time Filter)
// ==========================================================================
document.getElementById("searchInput")?.addEventListener("keyup", function() {
  const keyword = this.value.toLowerCase().trim();

  // Filter artikel berdasarkan judul atau deskripsi yang mengandung keyword
  currentData = articles.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.desc.toLowerCase().includes(keyword)
  );

  // Setiap kali mencari, kembalikan posisi fokus ke halaman 1
  currentPage = 1;
  renderPagination(currentData);
});

// ==========================================================================
// 7. Render Artikel Populer (Berdasarkan jumlah views di LocalStorage)
// ==========================================================================
function renderPopular(data) {
  const list = document.getElementById("popular-list");
  if (!list) return;
  
  list.innerHTML = "";

  // Ambil data jumlah view dari localStorage untuk setiap artikel
  data.forEach(post => {
    post.views = parseInt(localStorage.getItem(post.id)) || 0;
  });

  // Urutkan dari yang paling banyak dikunjungi (descending)
  const popular = [...data].sort((a, b) => b.views - a.views);

  // Ambil top 3 teratas untuk ditampilkan
  popular.slice(0, 3).forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="popular-thumb">
      <div class="post-info">
        <a href="${post.link}" target="_blank">
          <h3>${post.title}</h3>
        </a>
        <p>${post.desc.substring(0, 80)}...</p>
        <small>Dikunjungi ${post.views} kali</small>
      </div>
    `;
    list.appendChild(li);
  });
}