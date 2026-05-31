// ===============================
// Perhitungan Persegi
// ===============================
function updateSquare() {
  const sisi = parseFloat(document.getElementById("sisi").value);

  const hasilBox = document.getElementById("hasil");
  const luasLabel = document.getElementById("luasLabel");
  const kelilingLabel = document.getElementById("kelilingLabel");
  const sisiLabel = document.getElementById("sisiLabel");

  if (isNaN(sisi) || sisi <= 0) {
    hasilBox.innerHTML = "⚠️ Masukkan angka positif yang valid!";
    luasLabel.innerText = "L = …";
    kelilingLabel.innerText = "K = …";
    sisiLabel.innerText = "s = …";
    return;
  }

  const luas = sisi * sisi;       // L = s × s
  const keliling = 4 * sisi;      // K = 4 × s

  hasilBox.innerHTML =
    `<strong>Rumus Luas:</strong> L = s × s<br>` +
    `Perhitungan: L = ${sisi} × ${sisi} = <b>${luas}</b><br><br>` +
    `<strong>Rumus Keliling:</strong> K = 4 × s<br>` +
    `Perhitungan: K = 4 × ${sisi} = <b>${keliling}</b>`;

  // Update label sisi
  sisiLabel.innerText = `s = ${sisi}`;

  // Update label hasil ringkas
  luasLabel.innerText = `L = ${luas}`;
  kelilingLabel.innerText = `K = ${keliling}`;
}
