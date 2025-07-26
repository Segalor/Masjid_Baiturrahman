let token = "";

function mintaTokenJikaPerlu() {
  if (!token) {
    token = prompt("Masukkan GitHub Token:");
  }
}

function muatHTML() {
  mintaTokenJikaPerlu();

  const file = document.getElementById("fileHTML").value;
  const username = "Segalor";
  const repo = "Masjid_Baiturrahman";

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`Gagal memuat file. Status: ${res.status}`);
      return res.text();
    })
    .then(data => {
      document.getElementById("editorHTML").value = data;
      document.getElementById("statusHTML").textContent = "✅ File berhasil dimuat.";
      document.getElementById("statusHTML").style.color = "green";
    })
    .catch(err => {
      console.error(err);
      document.getElementById("statusHTML").textContent = "❌ Gagal memuat file.";
      document.getElementById("statusHTML").style.color = "red";
    });
}

function simpanHTML() {
  mintaTokenJikaPerlu();

  const file = document.getElementById("fileHTML").value;
  const username = "Segalor";
  const repo = "Masjid_Baiturrahman";
  const isi = document.getElementById("editorHTML").value;

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Gagal mengambil SHA. Status: " + res.status);
      return res.json();
    })
    .then(data => {
      const sha = data.sha;
      const encoded = btoa(unescape(encodeURIComponent(isi)));

      return fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          message: `Update ${file} dari admin panel`,
          content: encoded,
          sha: sha
        })
      });
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          console.error("Gagal menyimpan:", text);
          throw new Error("❌ Gagal menyimpan perubahan.");
        });
      }
      document.getElementById("statusHTML").textContent = "✅ Perubahan berhasil disimpan!";
      document.getElementById("statusHTML").style.color = "green";
    })
    .catch(err => {
      console.error(err);
      document.getElementById("statusHTML").textContent = "❌ Gagal menyimpan perubahan.";
      document.getElementById("statusHTML").style.color = "red";
    });
}
