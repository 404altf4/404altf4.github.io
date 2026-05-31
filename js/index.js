let articles = [];

// Load data dari posts.json
fetch("Konten/posts.json")
  .then(res => res.json())
  .then(data => {
    articles = data.filter(post => post.type === "artikel");

    // tampilkan 4 artikel terbaru
    renderPosts(articles.slice(0, 4));

    // tampilkan popular posts
    renderPopular(data);
  })
  .catch(err => console.error("Gagal load posts.json:", err));

// Render artikel ke halaman utama
function renderPosts(list) {
  const container = document.getElementById("post-list");
  container.innerHTML = "";
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

// Event pencarian
document.getElementById("searchInput").addEventListener("keyup", function() {
  const keyword = this.value.toLowerCase();
  const filtered = articles.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.desc.toLowerCase().includes(keyword)
  );
  renderPosts(filtered);
});

// Render popular posts
function renderPopular(data) {
  const list = document.getElementById("popular-list");
  list.innerHTML = "";

  // Tambahkan jumlah views dari LocalStorage
  data.forEach(post => {
    post.views = parseInt(localStorage.getItem(post.id)) || 0;
  });

  // Urutkan berdasarkan views tertinggi
  const popular = [...data].sort((a, b) => b.views - a.views);

  // Ambil 3 teratas
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


let currentPage = 1;
const postsPerPage = 4;

function renderPagination(data) {
  const totalPages = Math.ceil(data.length / postsPerPage);

  // tampilkan artikel sesuai halaman
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  renderPosts(data.slice(start, end));

  // update tombol angka
  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPagination(data);
    });
    pageNumbers.appendChild(btn);
  }
  // kontrol tombol prev/next
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// event tombol prev/next
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPagination(articles);
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(articles.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPagination(articles);
  }
});
}





