
// ===============================
// Perhitungan Jajar Genjang
// ===============================
function hitungJajarGenjang() {
  const a = parseFloat(document.getElementById("alas").value);
  const t = parseFloat(document.getElementById("tinggi").value);
  const b = parseFloat(document.getElementById("sisiMiring").value);
  const L = parseFloat(document.getElementById("luas").value);
  const K = parseFloat(document.getElementById("keliling").value);

  const hasilBox = document.getElementById("hasil");
  const alasLabel = document.getElementById("alasLabel");
  const tinggiLabel = document.getElementById("tinggiLabel");
  const sisiMiringLabel = document.getElementById("sisiMiringLabel");

  let output = "";

  // 1. Keliling (K = 2(a+b))
  if (!isNaN(a) && !isNaN(b)) {
    const keliling = 2 * (a + b);
    output += `<strong>Keliling:</strong> 
      \\( K = 2(a+b) = 2(${a}+${b}) = ${toFraction(keliling)} \\)<br><br>`;
  }

  // 2. Luas (L = a × t)
  if (!isNaN(a) && !isNaN(t)) {
    const luas = a * t;
    output += `<strong>Luas:</strong> 
      \\( L = a \\times t = ${a} \\times ${t} = ${toFraction(luas)} \\)<br><br>`;
  }

  // 3. Alas (a = L ÷ t)
  if (!isNaN(L) && !isNaN(t) && t !== 0) {
    const alasHitung = L / t;
    output += `<strong>Alas:</strong> 
      \\( a = \\frac{L}{t} = \\frac{${L}}{${t}} = ${toFraction(alasHitung)} \\)<br><br>`;
  }

  // 4. Tinggi (t = L ÷ a)
  if (!isNaN(L) && !isNaN(a) && a !== 0) {
    const tinggiHitung = L / a;
    output += `<strong>Tinggi:</strong> 
      \\( t = \\frac{L}{a} = \\frac{${L}}{${a}} = ${toFraction(tinggiHitung)} \\)<br><br>`;
  }

  // 5. Sisi miring (b = K ÷ 2 - a)
  if (!isNaN(K) && !isNaN(a)) {
    const sisiMiringHitung = (K / 2) - a;
    if (sisiMiringHitung < 0) {
      output += `<strong>Sisi Miring:</strong> Nilai tidak valid (hasil negatif)<br><br>`;
    } else {
      output += `<strong>Sisi Miring:</strong> 
        \\( b = \\frac{K}{2} - a = \\frac{${K}}{2} - ${a} = ${toFraction(sisiMiringHitung)} \\)<br><br>`;
    }
  }

  if (output === "") {
    output = "⚠️ Masukkan kombinasi nilai sesuai rumus yang ingin dihitung.";
  }

  hasilBox.innerHTML = output;

  // Update label sisi di gambar
  alasLabel.innerText = !isNaN(a) ? `a = ${a}` : "a = …";
  tinggiLabel.innerText = !isNaN(t) ? `t = ${t}` : "t = …";
  sisiMiringLabel.innerText = !isNaN(b) ? `b = ${b}` : "b = …";

  // Trigger MathJax render ulang
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

// Fungsi konversi ke pecahan sederhana
function toFraction(num) {
  if (Number.isInteger(num)) return num.toString();
  if (Math.abs(num - 0.5) < 0.0001) return "1/2";
  if (Math.abs(num - 0.25) < 0.0001) return "1/4";
  if (Math.abs(num - 0.75) < 0.0001) return "3/4";
  if (Math.abs(num - 0.3333) < 0.0001) return "1/3";
  if (Math.abs(num - 0.6666) < 0.0001) return "2/3";
  return num.toFixed(2); // fallback desimal
}