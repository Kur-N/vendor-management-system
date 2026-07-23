import os
import logging

# ==========================================
# 1. ENVIRONMENT & LOGGING CONFIG
# ==========================================
APP_ENV = os.getenv("APP_ENV", "development").lower()

# Pemetaan level log otomatis berdasarkan environment
LOG_LEVELS = {
    "development": logging.DEBUG,
    "beta": logging.INFO,
    "production": logging.WARNING
}
LOG_LEVEL = LOG_LEVELS.get(APP_ENV, logging.INFO)

# ==========================================
# 2. MONGODB CONFIG
# ==========================================
# Secara default menunjuk ke host 'mongo' (nama service di docker-compose)
URI_MONGO = os.getenv("URI_MONGO", "mongodb://mongo:27017")
DATABASE = os.getenv("DATABASE", "vms_project")

# Nama-nama collection biasanya statis, jadi aman untuk di-hardcode di sini
USER_COLLECTION = "user"
VENDOR_COLLECTION = "vendor"
BRANCH_COLLECTION = "branch"
BANK_COLLECTION = "bank"

# ==========================================
# 3. REDIS CONFIG
# ==========================================
# Secara default menunjuk ke host 'redis' (nama service di docker-compose)
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
# Default None untuk lokal agar tidak perlu password saat testing
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)