
// ===============================
// Ambil ID artikel dari body
// ===============================
const articleId = document.body.getAttribute("data-article-id");

// Counter views
let views = localStorage.getItem(articleId) || 0;
views++;
localStorage.setItem(articleId, views);

// ===============================
// Pencarian isi artikel
// ===============================
const searchInput = document.getElementById("searchInput");

// Cari elemen konten: bisa timeline atau card
let sections = document.querySelectorAll("main .timeline");
if (sections.length === 0) {
  sections = document.querySelectorAll("main .card");
}

if (searchInput) {
  searchInput.addEventListener("keyup", function() {
    const keyword = this.value.toLowerCase();
    sections.forEach(section => {
      const text = section.textContent.toLowerCase();
      if (text.includes(keyword)) {
        section.style.display = "";
        // reset highlight sebelum menambahkan
        section.innerHTML = section.innerHTML.replace(/<mark>|<\/mark>/gi, "");
        const regex = new RegExp(`(${keyword})`, "gi");
        section.innerHTML = section.innerHTML.replace(regex, "<mark>$1</mark>");
      } else {
        section.style.display = "none";
      }
    });
  });
}












