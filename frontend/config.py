import os
import logging
import sys

# ==========================================
# 1. ENVIRONMENT SETTINGS
# ==========================================
APP_ENV = os.getenv("APP_ENV", "development").lower()

# ==========================================
# 2. LOGGING CONFIGURATION
# ==========================================
def setup_logging():
    """Mengatur level log otomatis berdasarkan environment"""
    LOG_LEVELS = {
        "development": logging.DEBUG,
        "beta": logging.INFO,
        "production": logging.WARNING
    }
    
    log_level = LOG_LEVELS.get(APP_ENV, logging.INFO)
    
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s | frontend | %(levelname)-8s | %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    return logging.getLogger(__name__)

# ==========================================
# 3. API URL CONFIGURATION
# ==========================================
# Mapping URL cadangan jika .env tidak menyebutkan API_URL
API_URL_MAPPING = {
    "development": "http://backend:5000",          # Menunjuk ke container Podman di lokal
    "beta": "https://api-beta.kapita.com", # Contoh URL untuk server testing
    "production": "https://api.kapita.com" # Contoh URL untuk live production
}

# Prioritas 1: Ambil dari .env (docker-compose)
# Prioritas 2: Jika kosong, ambil dari mapping berdasarkan APP_ENV
API_URL = os.getenv("API_URL", API_URL_MAPPING.get(APP_ENV, "http://backend:5000"))