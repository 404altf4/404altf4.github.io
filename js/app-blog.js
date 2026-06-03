/* ==========================================================================
   1. KONFIGURASI URL GOOGLE APPS SCRIPT
   ========================================================================== */
// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT KAMU YANG SUDAH BERISI FUNGSI doGet()
const SCRIPT_URL = "MASUKKAN_URL_WEB_APP_KAMU_DISINI"; 

/* ==========================================================================
   2. LOGIKA CORE: MENGAMBIL DAN MENAMPILKAN ARTIKEL
   ========================================================================== */
function muatArtikel() {
  if (SCRIPT_URL === "MASUKKAN_URL_WEB_APP_KAMU_DISINI" || SCRIPT_URL === "") {
    document.getElementById("loading").textContent = "⚠️ URL Web App belum dikonfigurasi.";
    return;
  }

  // Mengambil data JSON dari Google Sheets melalui jembatan Apps Script
  fetch(SCRIPT_URL)
    .then(response => {
      if (!response.ok) throw new Error("Gagal mengambil data dari server.");
      return response.json();
    })
    .then(data => {
      // Sembunyikan indikator loading jika data berhasil didapat
      document.getElementById("loading").style.display = "none";
      const feed = document.getElementById("feedArtikel");
      
      // Jika spreadsheet masih kosong (hanya ada baris judul kolom)
      if (data.length === 0) {
        feed.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Belum ada artikel yang diterbitkan.</p>";
        return;
      }

      // Membalik urutan data (Array) agar artikel terbaru yang di-post muncul di paling atas
      data.reverse();

      // Looping untuk menyusun struktur HTML kartu artikel satu per satu
      data.forEach(art => {
        feed.innerHTML += `
          <div class="artikel-card">
            <div class="meta-data">
              <span class="kategori-badge">${art.kategori}</span> 
              <span>| 📅 ${art.tanggal}</span> 
              <span>⏰ ${art.jam}</span>
            </div>
            <h2 class="artikel-judul">${art.judul}</h2>
            <div class="artikel-isi">${art.isi}</div>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("loading").textContent = "❌ Gagal memuat artikel. Periksa koneksi atau script Anda.";
    });
}

/* ==========================================================================
   3. EVENT LISTENER
   ========================================================================== */
// Menjalankan fungsi muatArtikel secara otomatis sesaat setelah seluruh halaman selesai dimuat
window.onload = muatArtikel;