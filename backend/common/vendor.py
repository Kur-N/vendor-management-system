from common.connectmongodb import ConnectMongoDB
from config import VENDOR_COLLECTION, BRANCH_COLLECTION, BANK_COLLECTION

class Vendor:
    def __init__(self):
        self.__connection = ConnectMongoDB()

    def selectOneVendor(self,filter):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        data,status = self.__connection.selectOneData(collection_name=VENDOR_COLLECTION, filter=filter)
        if data == None:
            result['message'] = "Vendor not found"
        elif status == False:
            result['message'] = "Gagal mengambil data vendor"
        if status == True and data != None:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil data vendor"
        return result

    def selectVendor(self):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        data,status = self.__connection.selectData(collection_name=VENDOR_COLLECTION,filter={})
        if len(data) == 0:
            result['message'] = "Vendor not found"
            result['status'] = True
        elif status == False:
            result['message'] = "Gagal mengambil semua data vendor"
        if status == True and len(data) != 0:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil semua data vendor"
        return result
    
    def insertVendor(self,data):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        dataInsert,status = self.__connection.insertData(collection_name=VENDOR_COLLECTION,value=data)
        if status == False:
            result['message'] = "Gagal menambahkan vendor."
        if status == True and dataInsert == True:
            result['status'] = True
            result['message'] = "Berhasil menambahkan vendor"
        return result

    def updateVendor(self,filter,value):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        dataUpdate,status = self.__connection.update(collection_name=VENDOR_COLLECTION,filter=filter,value=value)
        if dataUpdate == 0:
            result['message'] = "Gagal mengupdate data vendor."
            result['status'] = True
        elif status == False:
            result['message'] = "Terjadi kesalahan saat mengupdate data vendor."
        if status == True and dataUpdate != 0:
            result['message'] = "Berhasil mengupdate data vendor."
            result['status'] = True
        return result

    def deleteVendor(self,id):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        filter = {'_id':id}
        data,status = self.__connection.delete(collection_name=VENDOR_COLLECTION, filter=filter)
        if status == False:
            result['message'] = "Terjadi kesalahan menghapus data vendor."
        elif data == 0:
            result['message'] = "Gagal menghapus data vendor."
            result['status'] = True
        if status == True and data != 0:
            result['message'] = "Berhasil menghapus data vendor."
            result['status'] = True
        return result

class Branch:
    def __init__(self):
        self.__connection = ConnectMongoDB()

    def selectOneBranch(self, filter):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        data,status = self.__connection.selectOneData(collection_name=BRANCH_COLLECTION, filter=filter)
        if data == None:
            result['message'] = "Cabang not found"
        elif status == False:
            result['message'] = "Gagal mengambil data cabang"
        if status == True and data != None:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil data cabang"
        return result

    def selectBranch(self):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        data,status = self.__connection.selectData(collection_name=BRANCH_COLLECTION,filter={})
        if len(data) == 0:
            result['message'] = "Cabang not found"
            result['status'] = True
        elif status == False:
            result['message'] = "Gagal mengambil semua data cabang"
        if status == True and len(data) != 0:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil semua data cabang"
        return result

    def insertBranch(self,data):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        dataInsert,status = self.__connection.insertData(collection_name=BRANCH_COLLECTION,value=data)
        if status == False:
            result['message'] = "Gagal menambahkan cabang."
        if status == True and dataInsert == True:
            result['status'] = True
            result['message'] = "Berhasil menambahkan cabang"
        return result

    def updateBranch(self,filter,value):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        dataUpdate,status = self.__connection.update(collection_name=BRANCH_COLLECTION,filter=filter,value=value)
        if dataUpdate == 0:
            result['message'] = "Gagal mengupdate data cabang."
            result['status'] = True
        elif status == False:
            result['message'] = "Terjadi kesalahan saat mengupdate data cabang."
        if status == True and dataUpdate != 0:
            result['message'] = "Berhasil mengupdate data cabang."
            result['status'] = True
        return result

    def deleteBranch(self,id):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        filter = {'_id':id}
        data,status = self.__connection.delete(collection_name=BRANCH_COLLECTION, filter=filter)
        if status == False:
            result['message'] = "Terjadi kesalahan menghapus data cabang."
        elif data == 0:
            result['message'] = "Gagal menghapus data cabang."
            result['status'] = True
        if status == True and data != 0:
            result['message'] = "Berhasil menghapus data cabang."
            result['status'] = True
        return result
    
    def deleteManyBranch(self, filter):
        result ={
            'status':False,
            'data':None,
            'message':""
        }
        data,status = self.__connection.deleteMany(collection_name=BRANCH_COLLECTION, filter=filter)
        if status == False:
            result['message'] = "Terjadi kesalahan menghapus data cabang."
        elif data == 0:
            result['message'] = "Gagal menghapus data cabang."
            result['status'] = True
        if status == True and data != 0:
            result['message'] = "Berhasil menghapus data cabang."
            result['status'] = True
        return result

class Bank:
    def __init__(self):
        self.__connection = ConnectMongoDB()

    def selectOneBank(self, filter):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        data,status = self.__connection.selectOneData(collection_name=BANK_COLLECTION, filter=filter)
        if data == None:
            result['message'] = "Bank not found"
        elif status == False:
            result['message'] = "Gagal mengambil data bank"
        if status == True and data != None:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil data bank"
        return result

    def selectBank(self):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        data,status = self.__connection.selectData(collection_name=BANK_COLLECTION,filter={})
        if len(data) == 0:
            result['message'] = "Bank not found"
            result['status'] = True
        elif status == False:
            result['message'] = "Gagal mengambil semua data bank"
        if status == True and len(data) != 0:
            result['status'] = True
            result['data'] = data
            result['message'] = "Berhasil mengambil semua data bank"
        return result

    def insertBank(self,data):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        dataInsert,status = self.__connection.insertData(collection_name=BANK_COLLECTION,value=data)
        if status == False:
            result['message'] = "Gagal menambahkan bank."
        if status == True and dataInsert == True:
            result['status'] = True
            result['message'] = "Berhasil menambahkan bank"
        return result

    def updateBank(self,id,value):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        filter = {'_id':id}
        dataUpdate,status = self.__connection.update(collection_name=BANK_COLLECTION,filter=filter,value=value)
        if dataUpdate == 0:
            result['message'] = "Gagal mengupdate data bank."
            result['status'] = True
        elif status == False:
            result['message'] = "Terjadi kesalahan saat mengupdate data bank."
        if status == True and dataUpdate != 0:
            result['message'] = "Berhasil mengupdate data bank."
            result['status'] = True
        return result

    def deleteBank(self,id):
        result = {
            'status':False,
            'data':None,
            'message':""
        }
        filter = {'_id':id}
        data,status = self.__connection.delete(collection_name=BANK_COLLECTION, filter=filter)
        if status == False:
            result['message'] = "Terjadi kesalahan menghapus data bank."
        elif data == 0:
            result['message'] = "Gagal menghapus data bank."
            result['status'] = True
        if status == True and data != 0:
            result['message'] = "Berhasil menghapus data bank."
            result['status'] = True
        return result