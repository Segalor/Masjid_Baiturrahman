const token = "ghp_xxxxxx"; // GANTI dengan GitHub Token milikmu
const username = "Segalor";
const repo = "Masjid_Baiturrahman";
const branch = "main";

async function muatHTML() {
  const file = document.getElementById("fileHTML").value;
  const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
    headers: {
      Authorization: `token ${token}`
    }
  });
  const data = await res.json();
  const content = atob(data.content.replace(/\n/g, ""));
  document.getElementById("editorHTML").value = content;
  document.getElementById("editorHTML").dataset.sha = data.sha;
  document.getElementById("statusHTML").textContent = "✅ Berhasil membuka " + file;
}

async function simpanHTML() {
  const file = document.getElementById("fileHTML").value;
  const isi = document.getElementById("editorHTML").value;
  const sha = document.getElementById("editorHTML").dataset.sha;

  const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Update file ${file} via admin panel`,
      content: btoa(unescape(encodeURIComponent(isi))),
      sha: sha,
      branch: branch
    })
  });

  if (res.ok) {
    document.getElementById("statusHTML").textContent = "✅ Berhasil disimpan ke " + file;
    muatHTML(); // refresh SHA baru
  } else {
    document.getElementById("statusHTML").textContent = "❌ Gagal menyimpan. Cek token dan izin repo.";
  }
}
