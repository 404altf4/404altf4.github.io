// Variabel global
let articles = [];
let currentPage = 1;
const postsPerPage = 4;

// Load data dari posts.json
fetch("Konten/posts.json")
  .then(res => res.json())
  .then(data => {
    // Filter hanya artikel kategori rumus
    articles = data.filter(post => post.type === "artikel" && post.category === "rumus");

    // Tampilkan halaman pertama
    renderPagination(articles);

    // Tampilkan popular rumus (5 teratas)
    renderPopular(articles);
  })
  .catch(err => console.error("Gagal load posts.json:", err));

/* ------------------------
   Render Artikel
------------------------- */
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

/* ------------------------
   Render Popular Rumus
------------------------- */
function renderPopular(list) {
  const container = document.getElementById("popular-list");
  container.innerHTML = "";

  list.slice(0, 5).forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        <img src="${post.image}" alt="${post.title}" 
             style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
        <a href="${post.link}" target="_blank">${post.title}</a>
      </div>
    `;
    container.appendChild(li);
  });
}

/* ------------------------
   Pagination
------------------------- */
function renderPagination(data) {
  const totalPages = Math.ceil(data.length / postsPerPage);

  // Artikel sesuai halaman
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  renderPosts(data.slice(start, end));

  // Tombol angka
  const pageNumbers = document.getElementById("pageNumbers");
  if (pageNumbers) {
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
  }

  // Kontrol prev/next
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

/* ------------------------
   Event tombol prev/next
------------------------- */
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPagination(articles);
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(articles.length / postsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPagination(articles);
    }
  });
}
