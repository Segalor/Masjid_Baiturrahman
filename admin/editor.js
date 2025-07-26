const halaman = document.getElementById("halaman");
const judul = document.getElementById("judul");
const isi = document.getElementById("isi");
const status = document.getElementById("status");

halaman.addEventListener("change", muatKonten);
window.addEventListener("load", muatKonten);

function muatKonten() {
  const namaFile = halaman.value;
  fetch(`../data/${namaFile}.json`)
    .then(res => res.json())
    .then(data => {
      judul.value = data.judul || "";
      isi.value = data.isi || "";
      status.textContent = "Konten berhasil dimuat.";
    })
    .catch(() => {
      status.textContent = "Gagal memuat konten.";
    });
}

function simpanKonten() {
  alert("Fitur simpan belum aktif. Ini baru tampilan awal.");
}
