import redis
import logging

# Import konfigurasi yang sudah kita buat sebelumnya
from config import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD

class RedisClient():

    def __init__(self):
        try:
            # Gunakan variabel dari environment/config
            self.__redisConnection = redis.Redis(
                host=REDIS_HOST, 
                port=REDIS_PORT,
                db=REDIS_DB, 
                password=REDIS_PASSWORD
            )
        except Exception as error:
            logging.error(f"Error Connect Redis: {error}")

    def getRedisConnection(self):
        return self.__redisConnection

    def verifySession(self, sessionKey=None):
        try:
            connection = self.__redisConnection
            resultCheck = connection.hgetall(sessionKey)
            # Disederhanakan: cek apakah dictionary kosong
            if not resultCheck: 
                return False
            return True
        except Exception as error:
            logging.error(f"Error Verify Session: {error}")
            return False
    
    def getUserRole(self, sessionKey=None):
        try:
            connection = self.__redisConnection
            role = connection.hget(sessionKey, b'role')
            
            # Pengecekan aman untuk mencegah AttributeError jika role adalah None
            if role:
                return role.decode("utf-8")
            
            # Kembalikan None jika key tidak ditemukan
            return None 
        except Exception as error:
            logging.error(f"Error get user role: {error}")
            return None