# Vendor Management System (VMS) - Microservices Portfolio

Ini adalah aplikasi Vendor Management System yang dibangun menggunakan arsitektur _microservices_ (Frontend dan Backend terpisah) berbasis Python Flask, Webix (UI), MongoDB, dan Redis. Aplikasi ini telah sepenuhnya dikonfigurasi untuk berjalan di atas _container_ menggunakan Docker / Podman.

## 🛠️ Tech Stack

- **Backend:** Python 3.9, Flask, Flask-RESTful, Flask-Bcrypt, Gunicorn
- **Frontend:** Python 3.9, Flask (Routing/Session Handling), Webix, Gunicorn
- **Database:** MongoDB
- **Caching & Session:** Redis
- **Infrastructure:** Docker & Docker Compose / Podman

---

## 🚀 Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi ini, pastikan sistem Anda telah terinstal:

1. [Git](https://git-scm.com/)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) atau [Podman](https://podman.io/) beserta Compose.
3. Windows Subsystem for Linux (WSL) - _Direkomendasikan untuk pengguna Windows._

---

## 📦 Cara Menjalankan Aplikasi (Local Setup)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal di mesin Anda.

### 1. Clone Repositori

Buka terminal Anda (disarankan menggunakan terminal Linux/WSL untuk performa terbaik) dan jalankan perintah berikut:

```bash
git clone https://github.com/username-anda/nama-repo-portofolio.git
cd nama-repo-portofolio
```

_(Ganti URL di atas dengan URL repository GitHub Anda yang sebenarnya)_

### 2. Siapkan Environment Variables

Aplikasi ini membutuhkan file `.env` untuk mengatur konfigurasi _database_, antarmuka jaringan, dan rahasia lainnya. Anda cukup menduplikasi file _template_ yang sudah disediakan.

**Untuk pengguna Linux/Mac/WSL:**

```bash
cp .env.example .env
```

**Untuk pengguna Windows (Command Prompt):**

```cmd
copy .env.example .env
```

> **Catatan:** Nilai _default_ di dalam `.env.example` sudah disesuaikan dengan arsitektur _container_. Anda **tidak perlu mengubah apa pun** di dalam file `.env` untuk menjalankan aplikasi ini secara lokal.

### 3. Build dan Jalankan Container

Gunakan Docker Compose atau Podman Compose untuk membangun (_build_) _image_ dan menyalakan semua _service_ secara bersamaan di latar belakang (_detached mode_).

**Jika menggunakan Docker:**

```bash
docker-compose up -d --build
```

**Jika menggunakan Podman:**

```bash
podman-compose up -d --build
```

Proses ini mungkin memakan waktu beberapa menit pada saat pertama kali dijalankan karena sistem akan mengunduh _image_ MongoDB, Redis, dan Python.

### 4. Akses Aplikasi

Setelah proses _build_ selesai dan terminal kembali aktif, Anda dapat mengakses aplikasi melalui _browser_:

- 🖥️ **Frontend (Web Interface):** [http://localhost:8080](http://localhost:8080)
- ⚙️ **Backend (API Base URL):** [http://localhost:5000](http://localhost:5000)

---

## 🛑 Menghentikan Aplikasi

Untuk mematikan semua _container_ aplikasi tanpa menghapus data di _database_, jalankan perintah berikut:

```bash
docker-compose stop
# atau
podman-compose stop
```

Jika Anda ingin mematikan sekaligus menghapus _container_ (data di dalam _volume_ MongoDB akan tetap aman):

```bash
docker-compose down
# atau
podman-compose down
```

---

## 📂 Struktur Direktori Utama

```text
├── backend/            # Source code API (Flask-RESTful)
├── frontend/           # Source code Web UI (Flask + Webix HTML)
├── docker-compose.yml  # Orkestrasi seluruh container
├── .env.example        # Template untuk environment variables
└── README.md           # Dokumentasi proyek
```
