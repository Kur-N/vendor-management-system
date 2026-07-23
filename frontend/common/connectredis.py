import redis
import logging
import os

class RedisClient():

    def __init__(self):
        try:
            # Mengambil dari environment, default mengarah ke service 'redis' di Docker
            redis_host = os.getenv("REDIS_HOST", "redis")
            redis_port = int(os.getenv("REDIS_PORT", 6379))
            redis_db = int(os.getenv("REDIS_DB", 0))
            redis_password = os.getenv("REDIS_PASSWORD", None)

            self.__redisConnection = redis.Redis(
                host=redis_host, 
                port=redis_port,
                db=redis_db, 
                password=redis_password
            )
        except Exception as error:
            logging.error(f"Error Connect Redis: {error}")

    def getRedisConnection(self):
        return self.__redisConnection

    def checkCookieData(self, cookieData):
        try:
            connection = self.__redisConnection
            resultCheck = connection.hgetall(cookieData)
            
            if not resultCheck: 
                return False
            return True
        except Exception as error:
            logging.error(f"Error Check Cookie Data: {error}")
            return False
    
    def getCookieData(self, cookieData):
        data = None
        status = False
        try:
            connection = self.__redisConnection
            sessionData = connection.hgetall(cookieData)
            # Akan mengembalikan dictionary kosong {} jika sessionData kosong
            data = {key.decode("utf-8") : value.decode("utf-8") for key, value in sessionData.items()}
            status = True
            return data, status
        except Exception as error:
            logging.error(f"Error Get Cookie Data: {error}")
        return data, status

    def deleteCookieData(self, cookieData):
        try:
            connection = self.__redisConnection
            connection.delete(cookieData)
        except Exception as error:
            logging.error(f"Error Delete Cookie Data: {error}")