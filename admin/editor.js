const halaman = document.getElementById("halaman");
const judul = document.getElementById("judul");
const isi = document.getElementById("isi");
const status = document.getElementById("status");

const GITHUB_TOKEN = localStorage.getItem("github_token") || "";
const USERNAME = "Segalor";
const REPO = "Masjid_Baiturrahman";
const BRANCH = "main";

halaman.addEventListener("change", muatKonten);
window.addEventListener("load", muatKonten);

function muatKonten() {
  const namaFile = halaman.value;
  fetch(`../data/${namaFile}.json`)
    .then(res => res.json())
    .then(data => {
      judul.value = data.judul || "";
      isi.value = data.isi || "";
      status.textContent = "✅ Konten berhasil dimuat.";
    })
    .catch(() => {
      status.textContent = "❌ Gagal memuat konten.";
    });
}

function encodeToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

async function simpanKonten() {
  const fileName = halaman.value + ".json";
  const path = `data/${fileName}`;
  const newContent = {
    judul: judul.value.trim(),
    isi: isi.value.trim()
  };
  const message = `Update ${fileName} dari Admin Panel`;

  if (!GITHUB_TOKEN) {
    const token = prompt("Masukkan GitHub Token:");
    if (!token) return alert("Token dibutuhkan.");
    localStorage.setItem("github_token", token);
    location.reload();
    return;
  }

  const getUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${path}`;
  const headers = {
    "Authorization": `Bearer ${localStorage.getItem("github_token")}`,
    "Accept": "application/vnd.github+json"
  };

  try {
    const getRes = await fetch(getUrl, { headers });
    const fileData = await getRes.json();

    const payload = {
      message,
      content: encodeToBase64(JSON.stringify(newContent, null, 2)),
      sha: fileData.sha,
      branch: BRANCH
    };

    const putRes = await fetch(getUrl, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (putRes.ok) {
      status.textContent = "✅ Berhasil disimpan ke GitHub!";
    } else {
      const err = await putRes.json();
      throw new Error(err.message || "Gagal menyimpan.");
    }

  } catch (err) {
    console.error("Error:", err);
    alert("❌ Gagal menyimpan: " + err.message);
  }
}
