const username = "segalor"; // Ganti jika repo bukan atas nama segalor
const repo = "Masjid_Baiturrahman"; // Ganti jika nama repo berbeda
const branch = "main";

function saveToken() {
  const token = document.getElementById("token").value;
  localStorage.setItem("github_token", token);
  alert("Token disimpan di browser.");
}

async function loadFile() {
  const token = localStorage.getItem("github_token");
  const path = document.getElementById("filePath").value;

  const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!res.ok) {
    alert("Gagal memuat file. Periksa path dan token.");
    return;
  }

  const data = await res.json();
  const content = atob(data.content);

  document.getElementById("fileContent").value = content;
  document.getElementById("fileContent").setAttribute("data-sha", data.sha);
}

async function saveFile() {
  const token = localStorage.getItem("github_token");
  const path = document.getElementById("filePath").value;
  const content = document.getElementById("fileContent").value;
  const sha = document.getElementById("fileContent").getAttribute("data-sha") || "";

  const body = {
    message: `Update ${path} via Admin Panel`,
    content: btoa(unescape(encodeURIComponent(content))),
    sha: sha,
    branch: branch,
  };

  const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert("Berhasil menyimpan file ke GitHub!");
    document.getElementById("fileContent").setAttribute("data-sha", (await res.json()).content.sha);
  } else {
    alert("Gagal menyimpan file. Cek token atau path.");
  }
}

async function uploadImage() {
  const token = localStorage.getItem("github_token");
  const fileInput = document.getElementById("uploadInput");
  const file = fileInput.files[0];

  if (!file) return alert("Pilih file gambar terlebih dahulu.");

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1];
    const fileName = `img/${file.name}`;

    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${fileName}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${file.name} via Admin Panel`,
        content: base64,
        branch: branch,
      }),
    });

    if (res.ok) {
      alert("Gambar berhasil diunggah!");
    } else {
      alert("Gagal mengunggah gambar.");
    }
  };
  reader.readAsDataURL(file);
}
