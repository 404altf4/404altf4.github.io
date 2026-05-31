// ===============================
// Perhitungan Persegi Panjang
// ===============================
function updateRectangle() {
  const panjang = parseFloat(document.getElementById("panjang").value);
  const lebar   = parseFloat(document.getElementById("lebar").value);

  const hasilBox = document.getElementById("hasil");
  const panjangLabel = document.getElementById("panjangLabel");
  const lebarLabel   = document.getElementById("lebarLabel");

  if (isNaN(panjang) || isNaN(lebar) || panjang <= 0 || lebar <= 0) {
    hasilBox.innerHTML = "⚠️ Masukkan angka positif yang valid!";
    panjangLabel.innerText = "p = …";
    lebarLabel.innerText   = "l = …";
    return;
  }

  const luas = panjang * lebar;
  const keliling = 2 * (panjang + lebar);

  hasilBox.innerHTML =
    `<strong>Rumus Luas:</strong> L = p × l<br>` +
    `Perhitungan: L = ${panjang} × ${lebar} = <b>${luas}</b><br><br>` +
    `<strong>Rumus Keliling:</strong> K = 2 × (p + l)<br>` +
    `Perhitungan: K = 2 × (${panjang} + ${lebar}) = <b>${keliling}</b>`;

  panjangLabel.innerText = `p = ${panjang}`;
  lebarLabel.innerText   = `l = ${lebar}`;
}