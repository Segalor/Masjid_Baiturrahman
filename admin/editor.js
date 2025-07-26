// Ganti dengan username dan repo kamu
const username = "Segalor";
const repo = "Masjid_Baiturrahman";

// Token kamu (simpan baik-baik, jangan bocorkan ke publik)
const token = "ghp_xxx..."; // <- GANTI dengan GitHub Token kamu

const editor = document.getElementById("editorHTML");
const fileSelect = document.getElementById("fileHTML");
const status = document.getElementById("statusHTML");

let sha = ""; // Untuk menyimpan versi terakhir file di GitHub

function muatHTML() {
  const file = fileSelect.value;
  status.textContent = "Memuat...";
  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3.raw"
    }
  })
    .then(res => {
      sha = "";
      if (!res.ok) throw new Error("Gagal memuat file.");
      return res.text();
    })
    .then(text => {
      editor.value = text;
      return fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json"
        }
      });
    })
    .then(res => res.json())
    .then(data => {
      sha = data.sha;
      status.textContent = "Berhasil dimuat.";
    })
    .catch(err => {
      console.error(err);
      status.textContent = "Gagal memuat file.";
    });
}

function simpanHTML() {
  const file = fileSelect.value;
  const kontenBaru = editor.value;
  const encoded = btoa(unescape(encodeURIComponent(kontenBaru)));

  if (!sha) {
    status.textContent = "File belum dimuat!";
    return;
  }

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: `update ${file} via admin panel`,
      content: encoded,
      sha: sha
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Gagal menyimpan.");
      return res.json();
    })
    .then(data => {
      sha = data.content.sha;
      status.textContent = "Berhasil disimpan ke GitHub.";
    })
    .catch(err => {
      console.error(err);
      status.textContent = "Gagal menyimpan perubahan.";
    });
}
