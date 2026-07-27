# ⚙️ VMS - Backend Service & API

Modul _backend_ untuk Vendor Management System (VMS). Layanan ini dirancang sebagai _microservice_ terpisah yang menangani logika bisnis, autentikasi berbasis sesi, serta operasi CRUD ke _database_.

Secara _default_, layanan ini diorkestrasi menggunakan Docker Compose dari direktori utama (_root_), namun Anda tetap dapat menjalankannya secara lokal untuk keperluan pengembangan (_development_).

## 🛠️ Tech Stack & Pustaka Utama

- **Python 3.9**
- **Flask & Flask-RESTful:** Framework utama dan penyedia REST API.
- **Flask-Bcrypt:** Hashing _password_ untuk keamanan kredensial.
- **PyMongo:** Driver untuk koneksi ke database MongoDB.
- **Redis:** Manajemen antrean dan penyimpanan sesi aktif.
- **Gunicorn:** WSGI HTTP Server untuk produksi.

---

## 🚀 Menjalankan Backend Secara Lokal (Tanpa Docker)

Jika Anda sedang mengembangkan API atau melakukan _debugging_, jalankan langkah berikut:

### 1. Persiapan Virtual Environment

```bash
cd backend
python -m venv venv

# Aktivasi di Windows:
venv\Scripts\activate
# Aktivasi di Mac/Linux:
source venv/bin/activate
```

### 2. Install Dependensi

```bash
pip install -r requirements.txt
```

### 3. Konfigurasi Environment & Database

Pastikan Anda memiliki instance **MongoDB** dan **Redis** yang berjalan di mesin lokal Anda. Buat file `.env` di dalam folder `backend` atau _root_ dan pastikan variabel berikut mengarah ke _localhost_:

```env
MONGO_URI=mongodb://localhost:27017/vms_db
REDIS_HOST=localhost
```

### 4. Jalankan Server Flask

```bash
python app.py
```

Server backend akan berjalan di `http://localhost:5000`.

---

## 🔌 Dokumentasi Endpoint REST API

Base URL: `http://localhost:5000`

### Autentikasi & Sesi

| Method | Endpoint   | Deskripsi                                                        |
| ------ | ---------- | ---------------------------------------------------------------- |
| GET    | `/session` | Mengambil data peran (_role_) dan info _user_ yang sedang login. |

### Manajemen Vendor

| Method | Endpoint       | Deskripsi                                                  |
| ------ | -------------- | ---------------------------------------------------------- |
| GET    | `/get-vendor`  | Mengambil daftar seluruh vendor aktif.                     |
| GET    | `/vendor/<id>` | Mengambil detail spesifik dari satu vendor berdasarkan ID. |

### Manajemen Cabang (Branch)

| Method | Endpoint       | Deskripsi                                             |
| ------ | -------------- | ----------------------------------------------------- |
| GET    | `/get-branch`  | Mengambil data seluruh cabang.                        |
| POST   | `/branch`      | Membuat data cabang baru.                             |
| PUT    | `/branch/<id>` | Memperbarui informasi cabang yang ada berdasarkan ID. |
| DELETE | `/branch/<id>` | Menghapus cabang berdasarkan ID.                      |
