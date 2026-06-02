/* ==========================================================================
   1. KONFIGURASI DATA & STATE APLIKASI
   ========================================================================== */
// GANTI DENGAN URL WEB APP KAMU!
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby0iWqfX8NDx478DBnNOcHZrNCyWBrV5SaiSI-kNkSU-HIwb7ss-EE2HWReAB_Im_Gi/exec";

const dataKategori = {
  "Harian": {
    "Makanan & Minuman Harian": ["Makan Siang & Malam", "Air Minum Isi Ulang / Galon"],
    "Gaya Hidup & Hiburan": ["Camilan & Kopi", "Nongkrong / Makan di Luar", "Hobi / Belanja Baju", "Perawatan Diri (Salon/Skincare/Gym)"],
    "Biaya Transportasi": ["BBM", "MRT", "Ojek", "Mobil"],
    "Lainnya": []
  },
  "Bulanan": {
    "Kebutuhan Pokok": ["Listrik", "Air", "Gas", "Belanja Bulanan (Groceries)"],
    "Kewajiban & Tagihan": ["Pulsa & Paket Data", "Internet Rumah (Wi-Fi)", "Iuran Lingkungan / Keamanan", "Langganan Streaming (Netflix, Spotify, dll.)"],
    "Keuangan Masa Depan": ["Tabungan", "Dana Darurat", "Investasi (Reksadana, Saham, Emas)", "Asuransi (Jiwa/Kesehatan)"],
    "Pengeluaran Tidak Terduga": ["Biaya Medis / Obat", "Donasi / Sedekah", "Servis Kendaraan"],
    "Lainnya": []
  }
};

// State untuk menyimpan daftar transaksi sementara di memory browser
let transaksiList = [];


/* ==========================================================================
   2. FUNGSI INISIALISASI (INIT)
   ========================================================================== */
function init() {
  setTanggalJam();
  updateKategori();
  setInterval(setTanggalJam, 1000); 
}


/* ==========================================================================
   3. FUNGSI PEMBANTU (HELPER FUNCTIONS)
   ========================================================================== */
function setTanggalJam() {
  const now = new Date();
  const txtTanggal = document.getElementById("txtTanggal");
  const txtJam = document.getElementById("txtJam");
  
  if (txtTanggal) txtTanggal.textContent = now.toLocaleDateString('id-ID');
  if (txtJam) txtJam.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatRupiah(num) {
  return "Rp " + (num || 0).toLocaleString('id-ID');
}

function formatNominal(input) {
  let value = input.value.replace(/\D/g, "");
  if (value) {
    input.value = parseInt(value).toLocaleString('id-ID');
  } else {
    input.value = "";
  }
}


/* ==========================================================================
   4. LOGIKA MANIPULASI DROPDOWN & INPUT KUSTOM
   ========================================================================== */
function updateKategori() {
  const jenis = document.getElementById("jenis").value;
  const kategoriSelect = document.getElementById("kategori");
  if (!kategoriSelect) return;
  
  kategoriSelect.innerHTML = "";

  Object.keys(dataKategori[jenis]).forEach(kat => {
    const opt = document.createElement("option");
    opt.value = kat;
    opt.textContent = kat;
    kategoriSelect.appendChild(opt);
  });

  updateSubKategori();
}

function updateSubKategori() {
  const jenis = document.getElementById("jenis").value;
  const kategori = document.getElementById("kategori").value;
  const subKategoriSelect = document.getElementById("subKategori");
  const kategoriCustom = document.getElementById("kategoriCustom");
  const subKategoriCustom = document.getElementById("subKategoriCustom");

  if (!subKategoriSelect) return;
  subKategoriSelect.innerHTML = "";

  if (kategori === "Lainnya") {
    kategoriCustom.style.display = "block";
    subKategoriCustom.style.display = "block";
    subKategoriSelect.style.display = "none";
  } else {
    kategoriCustom.style.display = "none";
    subKategoriCustom.style.display = "none";
    subKategoriSelect.style.display = "block";

    dataKategori[jenis][kategori].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subKategoriSelect.appendChild(opt);
    });
  }
}


/* ==========================================================================
   5. LOGIKA TRANSAKSI (TAMBAH & HAPUS)
   ========================================================================== */
function tambahTransaksi() {
  const jenis = document.getElementById("jenis").value;
  const kategori = document.getElementById("kategori").value;
  const kategoriCustom = document.getElementById("kategoriCustom")?.value || "";
  const subKategori = document.getElementById("subKategori").value;
  const subKategoriCustom = document.getElementById("subKategoriCustom")?.value || "";
  const nominalInput = document.getElementById("nominal");

  const rawNominal = nominalInput.value.replace(/\D/g, "");
  const nominal = parseInt(rawNominal) || 0;

  if (!nominal) {
    alert("Nominal pengeluaran harus diisi!");
    return;
  }

  // Validasi penentuan nama kategori jika user memilih opsi "Lainnya"
  const kategoriFinal = kategori === "Lainnya" ? (kategoriCustom.trim() || "Kategori Kustom") : kategori;
  const subKategoriFinal = kategori === "Lainnya" ? (subKategoriCustom.trim() || "Sub-Kategori Kustom") : subKategori;

  const now = new Date();
  const transaksi = {
    tanggal: now.toLocaleDateString('id-ID'),
    jam: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    jenis,
    kategori: kategoriFinal,
    subKategori: subKategoriFinal,
    nominal
  };

  transaksiList.push(transaksi);

  // Reset form input setelah data berhasil masuk array
  nominalInput.value = "";
  if (document.getElementById("kategoriCustom")) document.getElementById("kategoriCustom").value = "";
  if (document.getElementById("subKategoriCustom")) document.getElementById("subKategoriCustom").value = "";

  renderDaftarTransaksi();
  renderStruk();
}

function hapusTransaksi(index) {
  transaksiList.splice(index, 1);
  renderDaftarTransaksi();
  renderStruk();
}


/* ==========================================================================
   6. USER INTERFACE (UI) RENDERERS
   ========================================================================== */
function renderDaftarTransaksi() {
  const listDiv = document.getElementById("transaksiList");
  if (!listDiv) return;
  listDiv.innerHTML = "";

  transaksiList.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = "transaksi-item";
    item.innerHTML = `
      <span>
        <strong>[${t.jenis}]</strong> ${t.kategori}<br>
        <small style="color: #94a3b8;">* ${t.subKategori}</small><br>
        <strong>${formatRupiah(t.nominal)}</strong>
      </span>
      <button onclick="hapusTransaksi(${i})" class="btn-delete">Hapus</button>
    `;
    listDiv.appendChild(item);
  });
}

function renderStruk() {
  const kontainerStruk = document.getElementById("kontainerStruk");
  const listArea = document.querySelector("#areaStruk .transaksi-list");
  const txtTotal = document.getElementById("txtTotal");
  
  if (!kontainerStruk || !listArea || !txtTotal) return;

  if (transaksiList.length === 0) {
    kontainerStruk.style.display = "none";
    return;
  }

  kontainerStruk.style.display = "block";
  listArea.innerHTML = ""; // Bersihkan list struk tanpa merusak penataan DOM luar

  let total = 0;

  transaksiList.forEach(t => {
    total += t.nominal;
    listArea.innerHTML += `
      <div class="struk-row" style="font-weight:bold;"><span>${t.jenis} - ${t.kategori}</span></div>
      <div class="struk-row sub-row">
        <span>* ${t.subKategori}</span>
        <span>${formatRupiah(t.nominal)}</span>
      </div>
      <div class="divider"></div>
    `;
  });

  txtTotal.textContent = formatRupiah(total);
}


/* ==========================================================================
   7. INTEGRASI GOOGLE SHEETS & WHATSAPP API
   ========================================================================== */
function simpanKeGoogleSheets() {
  if (transaksiList.length === 0) {
    alert("Daftar transaksi masih kosong!");
    return;
  }

  if (SCRIPT_URL === "SALIN_URL_WEB_APP_GOOGLE_APPS_SCRIPT_DISINI" || SCRIPT_URL === "") {
    alert("Maaf, URL Google Apps Script belum dikonfigurasi di dalam file JavaScript.");
    return;
  }

  const btn = document.getElementById("btnSheets");
  btn.disabled = true;
  btn.textContent = "⏳ Menyimpan Data...";

  // POST Request yang aman dari pemblokiran muatan body (tanpa no-cors)
  fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(transaksiList)
  })
  .then(response => {
    if (!response.ok) throw new Error("Respons server bermasalah.");
    
    alert("🚀 Sukses! Data pengeluaran telah masuk ke Google Sheets.");
    transaksiList = [];
    renderDaftarTransaksi();
    renderStruk();
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Gagal menyimpan data ke Google Sheets. Periksa koneksi atau konfigurasi script.");
  })
  .finally(() => {
    btn.disabled = false;
    btn.textContent = "💾 Simpan ke Google Sheets";
  });
}

function bagikanKeWhatsApp() {
  const targetArea = document.getElementById("areaStruk");

  html2canvas(targetArea, { useCORS: true, scale: 2 }).then(canvas => {
    canvas.toBlob(async (blob) => {
      if (!blob) { alert("Gagal mengonversi struk."); return; }
      const fileStruk = new File([blob], `Struk_${Date.now()}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [fileStruk] })) {
        try {
          await navigator.share({
            files: [fileStruk],
            title: 'Struk Pembukuan',
            text: 'Berikut lampiran nota bukti pencatatan pengeluaran finansial saya.'
          });
        } catch (err) {
          kirimTeksWA();
        }
      } else {
        kirimTeksWA();
      }
    }, "image/png");
  });
}

function kirimTeksWA() {
  let pesan = "*NOTA PEMBUKUAN PENGELUARAN*\n";
  pesan += `Tanggal: ${document.getElementById("txtTanggal").textContent}\n`;
  pesan += `Jam: ${document.getElementById("txtJam").textContent}\n`;
  pesan += "--------------------------------------\n";
  
  transaksiList.forEach(t => {
    pesan += `• *[${t.jenis}]* ${t.kategori}\n  _${t.subKategori}_ → *${formatRupiah(t.nominal)}*\n`;
  });
  
  const total = transaksiList.reduce((a, b) => a + b.nominal, 0);
  pesan += "--------------------------------------\n";
  pesan += `*TOTAL AKHIR:* _${formatRupiah(total)}_`;
  
  const url = "https://wa.me/?text=" + encodeURIComponent(pesan);
  window.open(url, "_blank");
}