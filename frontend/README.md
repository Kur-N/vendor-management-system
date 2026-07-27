# 🎨 VMS - Frontend Interface

Modul _frontend_ untuk antarmuka Vendor Management System (VMS). Layanan ini menggunakan **Flask** hanya untuk keperluan _routing_ halaman (menyajikan HTML) dan session handling, sementara seluruh interaksi UI dikelola oleh **Webix UI** di sisi klien (_client-side_).

Sama seperti backend, antarmuka ini dirancang untuk dijalankan melalui Docker Compose. Panduan di bawah ini dikhususkan jika Anda ingin melakukan modifikasi UI secara lokal.

## 🛠️ Teknologi & Pengelolaan Aset

- **Python 3.9 & Flask:** Untuk _routing_ template.
- **Webix UI Framework (v11.x):** _Hosted locally_ untuk keandalan maksimal.
- **Material Design Icons (MDI):** File _font/icon_ mandiri.
- **Gunicorn:** Server aplikasi untuk _deployment_ di dalam _container_.

---

## 📂 Kebijakan Aset Lokal (_Offline-Ready_)

Untuk menghindari masalah _net::ERR_NAME_NOT_RESOLVED_ akibat kegagalan DNS atau pemblokiran pelacakan (_Tracking Prevention_) pada _browser_ saat mengambil file dari CDN eksternal, **seluruh aset inti di-host langsung di dalam proyek**.

Struktur aset statis:

```text
frontend/static/
├── webix.min.js          # Library utama Webix UI (Lokal)
├── webix.min.css         # Styling Webix (Lokal)
├── materialdesignicons/  # File pendukung ikon (Opsional)
├── branch.js             # Modul JS untuk halaman Branch
└── vendor.js             # Modul JS untuk halaman Vendor
```

## 🧩 Arsitektur Skrip Modular

Kami menghindari penggabungan logika ke dalam satu file JS raksasa. Setiap halaman memiliki file eksekutornya sendiri (contoh: `branch.js`):

1. **Scope Isolation:** Mencegah bentrok variabel antar halaman (misal: error deklarasi ulang `branchData`).
2. **Optimasi Muatan:** Browser hanya mengunduh skrip yang relevan dengan halaman yang sedang dibuka.
3. **Komunikasi API:** Semua proses AJAX Fetching diarahkan ke backend (`http://localhost:5000`).

---

## 🚀 Menjalankan Frontend Secara Lokal (Tanpa Docker)

Untuk mengembangkan tampilan UI secara mandiri:

### 1. Persiapan Environment

```bash
cd frontend
python -m venv venv

# Aktivasi VENV (Windows):
venv\Scripts\activate
# Aktivasi VENV (Mac/Linux):
source venv/bin/activate
```

### 2. Instalasi & Jalankan

```bash
pip install -r requirements.txt
python app.py
```

Antarmuka web dapat diakses di `http://localhost:8080`.

> **Perhatian:** Pastikan Anda juga sedang menjalankan _backend service_ di port `5000` agar tabel Webix dapat menarik data API dengan sukses.
