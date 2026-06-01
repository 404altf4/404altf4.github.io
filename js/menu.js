
// Load menu.html ke index.html
fetch("menu.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("menu").innerHTML = data;
  })
  .catch(err => console.error("Menu gagal dimuat:", err));
