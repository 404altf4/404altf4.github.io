// ===============================
// Set tanggal & jam otomatis
// ===============================
function setTanggalJam() {
  const now = new Date();
  document.getElementById("txtTanggal").textContent = now.toLocaleDateString('id-ID');
  document.getElementById("txtJam").textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setTanggalJam();

// ===============================
// Format Rupiah
// ===============================
function formatRupiah(num) {
  return "Rp " + (num || 0).toLocaleString('id-ID');
}

// ===============================
// Data kategori & subkategori
// ===============================
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

// ===============================
// Array transaksi
// ===============================
let transaksiList = [];

// ===============================
// Update kategori & subkategori
// ===============================
function updateKategori() {
  const jenis = document.getElementById("jenis").value;
  const kategoriSelect = document.getElementById("kategori");
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

// ===============================
// Tambah transaksi
// ===============================
function tambahTransaksi() {
  const jenis = document.getElementById("jenis").value;
  const kategori = document.getElementById("kategori").value;
  const kategoriCustom = document.getElementById("kategoriCustom")?.value || "";
  const subKategori = document.getElementById("subKategori").value;
  const subKategoriCustom = document.getElementById("subKategoriCustom")?.value || "";
  const nominal = parseInt(document.getElementById("nominal").value) || 0;

  if (!nominal) {
    alert("Nominal harus diisi!");
    return;
  }

  const transaksi = {
    jenis,
    kategori: kategori === "Lainnya" ? kategoriCustom : kategori,
    subKategori: kategori === "Lainnya" ? subKategoriCustom : subKategori,
    nominal
  };

  transaksiList.push(transaksi);
  renderDaftarTransaksi();
  renderStruk();
}

// ===============================
// Hapus transaksi
// ===============================
function hapusTransaksi(index) {
  transaksiList.splice(index, 1);
  renderDaftarTransaksi();
  renderStruk();
}

// ===============================
// Render daftar transaksi (dengan tombol hapus)
// ===============================
function renderDaftarTransaksi() {
  const listDiv = document.getElementById("transaksiList");
  listDiv.innerHTML = "";

  transaksiList.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = "transaksi-item";
    item.innerHTML = `
      <span>${t.jenis} - ${t.kategori} - ${t.subKategori} : ${formatRupiah(t.nominal)}</span>
      <button onclick="hapusTransaksi(${i})" class="btn-delete">Hapus</button>
    `;
    listDiv.appendChild(item);
  });
}

// ===============================
// Render struk (tanpa tombol hapus)
// ===============================
function renderStruk() {
  const container = document.getElementById("areaStruk");
  const listArea = container.querySelector(".transaksi-list") || document.createElement("div");
  listArea.className = "transaksi-list";
  listArea.innerHTML = "";

  let total = 0;
  transaksiList.forEach(t => {
    total += t.nominal;
    listArea.innerHTML += `
      <div class="struk-row"><span>${t.jenis}</span></div>
      <div class="struk-row"><span>${t.kategori}</span></div>
      <div class="struk-row sub-row">
        <span>- ${t.subKategori}</span>
        <span>${formatRupiah(t.nominal)}</span>
      </div>
      <div class="divider"></div>
    `;
  });

  const footer = container.querySelector(".struk-total");
  footer.insertAdjacentElement("beforebegin", listArea);
  container.querySelector(".struk-total span:last-child").textContent = formatRupiah(total);
}

// ===============================
// Bagikan ke WhatsApp
// ===============================
function bagikanKeWhatsApp() {
  const targetArea = document.getElementById("areaStruk");

  html2canvas(targetArea).then(canvas => {
    canvas.toBlob(async (blob) => {
      if (!blob) { alert("Gagal memproses gambar struk."); return; }
      const fileStruk = new File([blob], `Struk_${Date.now()}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [fileStruk] })) {
        try {
          await navigator.share({
            files: [fileStruk],
            title: 'Struk Pembukuan',
            text: 'Berikut adalah nota laporan pembukuan terbaru saya.'
          });
        } catch (err) {
          console.log("Pengiriman dibatalkan atau gagal:", err);
        }
      } else {
        let pesan = "NOTA PEMBUKUAN\n";
        transaksiList.forEach(t => {
          pesan += `${t.jenis} - ${t.kategori} - ${t.subKategori} : ${formatRupiah(t.nominal)}\n`;
        });
        pesan += `Total: ${formatRupiah(transaksiList.reduce((a,b)=>a+b.nominal,0))}`;
        const url = "https://wa.me/?text=" + encodeURIComponent(pesan);
        window.open(url, "_blank");
      }
    }, "image/png");
  });
}
function tambahTransaksi() {
  const jenis = document.getElementById("jenis").value;
  const kategori = document.getElementById("kategori").value;
  const kategoriCustom = document.getElementById("kategoriCustom")?.value || "";
  const subKategori = document.getElementById("subKategori").value;
  const subKategoriCustom = document.getElementById("subKategoriCustom")?.value || "";
  const nominalInput = document.getElementById("nominal");

  // ambil angka asli tanpa titik
  const rawNominal = nominalInput.value.replace(/\D/g, "");
  const nominal = parseInt(rawNominal) || 0;

  if (!nominal) {
    alert("Nominal harus diisi!");
    return;
  }

  const transaksi = {
    jenis,
    kategori: kategori === "Lainnya" ? kategoriCustom : kategori,
    subKategori: kategori === "Lainnya" ? subKategoriCustom : subKategori,
    nominal
  };

  transaksiList.push(transaksi);

  // reset input nominal agar kosong kembali
  nominalInput.value = "";

  // render ulang daftar & struk
  renderDaftarTransaksi();
  renderStruk();
}

// ===============================
// Inisialisasi
// ===============================
updateKategori();
