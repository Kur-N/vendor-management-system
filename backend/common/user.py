from common.connectmongodb import ConnectMongoDB
from config import USER_COLLECTION

class User:
    def __init__(self) :
        self.__connection = ConnectMongoDB()

    def selectOneUser(self, filter):
        result = {
            'status': False,
            'data': None,
            'message': "",
        }
        data, status = self.__connection.selectOneData(collection_name=USER_COLLECTION, filter=filter)
        if data == None:
            result['message'] = "User not found"
        elif status == False:
            result['message'] = "Gagal mengambil data user"
        if status == True and data != None:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil data user"
        return result
    
    def selectUser(self):
        result = {
            'status': False,
            'data': None,
            'message': ""
        }
        data, status = self.__connection.selectData(collection_name=USER_COLLECTION, filter={})
        if len(data) == 0:
            result['message'] = "User not found"
            result['status'] = True
        elif status == False:
            result['message'] = "Gagal mengambil semua data user"
        if status == True and len(data) != 0:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil semua data user"
        return result
        
    def insertUser(self, value):
        result = {
            'status': False,
            'data': None,
            'message': ""
        }
        data, status = self.__connection.insertData(collection_name=USER_COLLECTION, value=value)
        if status == False:
            result['message'] = "Gagal menambahkan data user"
        if status == True and data == True:
            result['status'] = True
            result['message'] = "Berhasil menambahkan user"
        return result
    
    def updateUser(self, filter, data):
        result = {
            'status': False,
            'data': None,
            'message': ""
        }
        value = {'$set': data}
        dataUpdate, status = self.__connection.update(collection_name=USER_COLLECTION, filter=filter, value=value)
        if dataUpdate == 0:
            result['message'] = "Gagal mengupdate data user."
            result['status'] = False
        elif status == False:
            result['message'] = "Terjadi kesalahan saat mengupdate data user."
        
        if status == True and dataUpdate != 0:
            result['status'] = True
            result['message'] = "Berhasil mengupdate data user."
        return result

    def deleteUser(self, id):
        result = {
            'status': False,
            'data': None,
            'message': ""
        }
        filter = {'_id': id}
        data, status = self.__connection.delete(collection_name=USER_COLLECTION, filter=filter)
        
        if status == False:
            result['message'] = "Terjadi kesalahan menghapus data user."
        elif data == 0:
            result['message'] = "Gagal menghapus data user (Data tidak ditemukan)."
            result['status'] = False  
        else:
            result['message'] = "Berhasil menghapus data user."
            result['status'] = True
            result['data'] = data
            
        return result