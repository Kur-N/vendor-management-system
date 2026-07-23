# Gunakan base image Python yang ringan
FROM python:3.9-slim

# Set direktori kerja di dalam container
WORKDIR /app

# Copy requirements.txt terlebih dahulu
COPY requirements.txt .

# Install semua library yang dibutuhkan
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh source code frontend (termasuk static dan templates)
COPY . .

# Beritahu Docker bahwa container ini menggunakan port 8080
EXPOSE 8080

# Jalankan aplikasi menggunakan Gunicorn
# 'main:app' berarti mencari variabel 'app' di dalam file 'main.py'
CMD ["gunicorn", "--workers", "2", "--bind", "0.0.0.0:8080", "main:app"]