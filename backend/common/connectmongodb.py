from pymongo import MongoClient, errors
from config import URI_MONGO, DATABASE
import logging

class ConnectMongoDB():
    def __init__(self) : 
        try:
            self.__connection = MongoClient(URI_MONGO)
            self.__db = self.__connection[DATABASE]
        except errors.ConnectionFailure as error:
            logging.error(f"Error Connect MongoDB (connection failure) | {error}")
        except Exception as error:
            logging.error(f"Error Connect MongoDB: {error}")
    
    def selectData(self, collection_name, filter):
        data = None
        status = False
        try:
            collection = self.__db[collection_name]
            result = collection.find(filter)
            data = list(result)
            for i in data:
                if "_id" in i:
                    i["_id"] = str(i["_id"])
            status = True
        except errors.PyMongoError as error:
            logging.error(f"Error selectData, error pymongo: {error}")
        except Exception as error:
            logging.error(f"Error selectData: {error}")
        return data, status

    def selectOneData(self, collection_name, filter):
        data = None
        status = False
        try:
            collection = self.__db[collection_name]
            result = collection.find_one(filter)
            
            # Pengecekan keamanan jika data tidak ditemukan di database
            if result is not None:
                data = result
                if '_id' in data:
                    data['_id'] = str(data['_id'])
                status = True
            else:
                status = True # Status tetap True secara query, tapi data bernilai None
        except errors.PyMongoError as error:
            logging.error(f"Error selectOneData, error pymongo: {error}")
        except Exception as error:
            logging.error(f"Error selectOneData: {error}")
        return data, status

    def insertData(self, collection_name, value):
        data = None
        status = False
        try:
            collection = self.__db[collection_name]
            result = collection.insert_one(value)
            data = result.acknowledged
            status = True
        except errors.PyMongoError as error:
            logging.error(f"Error insertData, error pymongo: {error}")
        except Exception as error:
            logging.error(f"Error insertData: {error}")
        return data, status

    def update(self, collection_name, filter, value):
        status = False
        data = None
        try:
            collection = self.__db[collection_name]
            result = collection.update_one(filter, value)
            data = result.modified_count
            status = True
        except errors.PyMongoError as error:
            logging.error(f"Error update, error pymongo: {error}")
        except Exception as error:
            logging.error(f"Error update: {error}")
        return data, status

    def delete(self, collection_name, filter):
        status = False
        data = None
        try:
            collection = self.__db[collection_name]
            result = collection.delete_one(filter)
            data = result.deleted_count
            status = True
        except errors.PyMongoError as error:
            logging.error(f"Error delete, error pymongo: {error}")
        except Exception as error:
            logging.error(f"Error delete: {error}")
        return data, status

    def deleteMany(self, collection_name, filter):
        status = False
        data = None
        try:
            collection = self.__db[collection_name]
            result = collection.delete_many(filter)
            data = result.deleted_count
            status = True
        except errors.PyMongoError as error:
            logging.error(f"Error deleteMany, error pymongo: {error}")
        except Exception as error:
            logging.error(f"Error deleteMany: {error}")
        return data, status

    def closeDB(self) :
        self.__connection.close()