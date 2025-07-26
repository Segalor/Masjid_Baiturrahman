const username = "Segalor";
const repo = "Masjid_Baiturrahman";
const token = "ghp_..."; // Token GitHub kamu

const editor = document.getElementById("editorHTML");
const fileSelect = document.getElementById("fileHTML");
const status = document.getElementById("statusHTML");
let sha = "";

function muatHTML() {
  const file = fileSelect.value;
  status.textContent = "Memuat...";
  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3.raw"
    }
  })
  .then(res => res.text())
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
  const encoded = btoa(unescape(encodeURIComponent(editor.value)));

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
  .then(res => res.json())
  .then(data => {
    status.textContent = "Berhasil disimpan ke GitHub.";
    sha = data.content.sha;
  })
  .catch(err => {
    console.error(err);
    status.textContent = "Gagal menyimpan.";
  });
}
