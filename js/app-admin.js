/* ==========================================================================
   1. KONFIGURASI WEB APP (GOOGLE APPS SCRIPT)
   ========================================================================== */
// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT BLOG KAMU NANTI!
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwsE6318kyaRKIiI7BrRmGuz1hbbRDgYqev4NcWBHfNy2m84_N1TPXevAMC_cZ6z7Tt/exec"; 

/* ==========================================================================
   2. INITIALIZE RICH TEXT EDITOR
   ========================================================================== */
tinymce.init({
  selector: '#isiArtikel',
  height: 400,
  plugins: 'lists link image code table wordcount',
  toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat | code',
  skin: 'oxide-dark', 
  content_css: 'dark'
});

/* ==========================================================================
   3. LOGIKA CORE: KIRIM DATA KE GOOGLE SHEETS
   ========================================================================== */
function publishArtikel() {
  const judul = document.getElementById("judul").value.trim();
  const kategori = document.getElementById("kategori").value;
  
  // Mengambil muatan konten HTML hasil ketikan di dalam TinyMCE
  const isiHTML = tinymce.get("isiArtikel").getContent(); 

  // Validasi Input
  if (!judul) {
    alert("Judul artikel tidak boleh kosong!");
    return;
  }
  if (!isiHTML || isiHTML.trim() === "") {
    alert("Isi artikel masih kosong!");
    return;
  }
  if (SCRIPT_URL === "") {
    alert("Gagal memposting! Anda belum memasukkan URL Google Apps Script di kode JavaScript.");
    return;
  }

  // Efek Loading pada Tombol
  const btn = document.getElementById("btnPublish");
  btn.disabled = true;
  btn.textContent = "⏳ Memposting ke Blog...";

  const now = new Date();
  
  // Mempersiapkan struktur objek data artikel
  const payload = {
    id: "ART-" + Date.now(), 
    tanggal: now.toLocaleDateString('id-ID'),
    jam: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    judul: judul,
    kategori: kategori,
    isi: isiHTML 
  };

  // Eksekusi POST data menggunakan Fetch API
  fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) throw new Error("Respons server bermasalah.");
    
    alert("🎉 Hore! Artikel kamu sukses terbit.");
    
    // Pembersihan form fields jika request sukses
    document.getElementById("judul").value = "";
    tinymce.get("isiArtikel").setContent("");
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Gagal memposting artikel. Silakan periksa jaringan atau script Anda.");
  })
  .finally(() => {
    btn.disabled = false;
    btn.textContent = "🚀 Publikasikan Artikel";
  });
}