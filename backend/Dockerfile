# Gunakan base image Python yang ringan
FROM python:3.9-slim

# Set direktori kerja di dalam container
WORKDIR /app

# Copy requirements.txt terlebih dahulu (untuk optimasi cache Docker)
COPY requirements.txt .

# Install semua library yang dibutuhkan
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh source code backend ke dalam container
COPY . .

# Beritahu Docker bahwa container ini menggunakan port 5000
EXPOSE 5000

# Jalankan aplikasi menggunakan Gunicorn
# 'main:app' berarti mencari variabel 'app' di dalam file 'main.py'
CMD ["gunicorn", "--workers", "2", "--bind", "0.0.0.0:5000", "main:app"]