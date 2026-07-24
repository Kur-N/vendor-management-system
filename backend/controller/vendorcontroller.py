from flask_restful import Resource, reqparse
from flask import request
from bson import ObjectId
from datetime import datetime
import pytz
import logging
from common.vendor import Vendor, Branch
from common.connectredis import RedisClient

commonVendor = Vendor()
commonRedis = RedisClient()
commonBranch = Branch()

class VendorController(Resource):
    def get(self, vendor_id=None):
        response = {
            'status': False,
            'message': '',
        }
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        if not resultVerify:
            response['status'] = False
            response['message'] = 'Unauthorized.'
            return response, 403
            
        if vendor_id is None:
            response = commonVendor.selectVendor()
            if response.get('status') == True:
                return response, 200
            return response, 400
            
        try:
            obj_id = ObjectId(vendor_id)
        except Exception as e:
            logging.error(f"Error ObjectId: {e}")
            response['status'] = False
            response['message'] = "Vendor Tidak ditemukan."
            return response, 404
        
        filter = {"_id": obj_id}
        response = commonVendor.selectOneVendor(filter=filter)
        if response.get('status') == True:
            return response, 200
        return response, 400

    def post(self):
        response = {
            'status': False,
            'message': '',
        }
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if not resultVerify or role != 'admin':
            response['status'] = False
            response['message'] = 'Unauthorized.'
            return response, 403
            
        parser = reqparse.RequestParser()
        parser.add_argument('partnerType')
        parser.add_argument('vendorName')
        parser.add_argument('unitUsaha')
        parser.add_argument('address')
        parser.add_argument('country')
        parser.add_argument('province')
        parser.add_argument('noTelp')
        parser.add_argument('emailCompany')
        parser.add_argument('namePIC')
        parser.add_argument('noTelpPIC')
        parser.add_argument('emailPIC')
        parser.add_argument('positionPIC')
        parser.add_argument('activeStatus')
        parser.add_argument('accountBank', type=list, location='json')
        args = parser.parse_args()

        filterVendorName = {'vendorName': args['vendorName']}
        vendorName = commonVendor.selectOneVendor(filter=filterVendorName)
        if vendorName.get('data') != None:
            return {'status': False, 'message': "Vendor Name sudah ada."}, 400
        
        # ambil data username dari session
        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))
        data = {
            'partnerType': args['partnerType'],
            'vendorName': args['vendorName'],
            'unitUsaha': args['unitUsaha'],
            'address': args['address'],
            'country': args['country'],
            'province': args['province'],
            'noTelp': args['noTelp'],
            'emailCompany': args['emailCompany'],
            'namePIC': args['namePIC'],
            'emailPIC': args['emailPIC'],
            'positionPIC': args['positionPIC'],
            'activeStatus': args['activeStatus'],
            'supportingEquipment': [],
            'branchOffice': [],
            'pic': [],
            'accountBank': args['accountBank'],
            'change': {
                'createDate': current_date,
                'createUser': strUserData,
                'updateUser': strUserData,
                'updateDate': current_date
            }
        }
        vendor = commonVendor.insertVendor(data=data)
        if vendor['status'] == False:
            return vendor, 400
        return vendor, 201

    def put(self, vendor_id):
        response = {
            'status': False,
            'message': '',
        }
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if not resultVerify or role != 'admin':
            response['status'] = False
            response['message'] = 'Unauthorized.'
            return response, 403
            
        parser = reqparse.RequestParser()
        parser.add_argument('partnerType')
        parser.add_argument('vendorName')
        parser.add_argument('unitUsaha')
        parser.add_argument('address')
        parser.add_argument('country')
        parser.add_argument('province')
        parser.add_argument('noTelp')
        parser.add_argument('emailCompany')
        parser.add_argument('namePIC')
        parser.add_argument('noTelpPIC')
        parser.add_argument('emailPIC')
        parser.add_argument('positionPIC')
        parser.add_argument('activeStatus')
        parser.add_argument('accountBank', type=list, location='json')
        args = parser.parse_args()

        try:
            obj_id = ObjectId(vendor_id)
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID."}, 400

        filterId = {'_id': obj_id}
        vendorId = commonVendor.selectOneVendor(filter=filterId)
        
        if not vendorId.get('status') or vendorId.get('data') is None:
            return {'status': False, 'message': "Vendor tidak ditemukan."}, 404

        if vendorId.get('data').get('vendorName') != args['vendorName']:
            filterVendorName = {'vendorName': args['vendorName']}
            vendorName = commonVendor.selectOneVendor(filter=filterVendorName)
            if vendorName.get('data') != None:
                return {'status': False, 'message': "Vendor Name sudah ada."}, 400

        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))
        data = {
            'partnerType': args['partnerType'],
            'vendorName': args['vendorName'],
            'unitUsaha': args['unitUsaha'],
            'address': args['address'],
            'country': args['country'],
            'province': args['province'],
            'noTelp': args['noTelp'],
            'emailCompany': args['emailCompany'],
            'namePIC': args['namePIC'],
            'emailPIC': args['emailPIC'],
            'positionPIC': args['positionPIC'],
            'activeStatus': args['activeStatus'],
            'accountBank': args['accountBank'],
            'change.updateUser': strUserData,
            'change.updateDate': current_date
        }
        value = {
            '$set': data,
        }
        vendor = commonVendor.updateVendor(filter=filterId, value=value)
        if vendor['status'] == True:
            return vendor, 200
        return vendor, 400

    def delete(self, vendor_id):
        response = {
            'status': False,
            'message': '',
        }
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if not resultVerify or role != 'admin':
            response['status'] = False
            response['message'] = 'Unauthorized.'
            return response, 403
        
        try:
            obj_id = ObjectId(vendor_id)
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID."}, 400

        filterBranch = {'vendor_id': vendor_id}
        branch = commonBranch.deleteManyBranch(filter=filterBranch)
        if branch['status'] == False:
            return branch, 400

        vendor = commonVendor.deleteVendor(id=obj_id)
        if vendor['status'] == True:
            return vendor, 200
        return vendor, 400
    
class VendorBranch(Resource):
    def put(self, vendor_id):
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if not resultVerify or role != 'admin':
            return {'status': False, 'message': 'Unauthorized.'}, 403
        
        parser = reqparse.RequestParser()
        parser.add_argument('branchName')
        parser.add_argument('location')
        parser.add_argument('address')
        parser.add_argument('noTelp')
        parser.add_argument('email')
        args = parser.parse_args()

        try:
            obj_id = ObjectId(vendor_id)
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID."}, 400

        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))

        filter = {'_id': obj_id, "branchOffice.branchName": args['branchName']}
        dataUpdate = {
            "branchOffice.$.location": args['location'],
            "branchOffice.$.address": args['address'],
            "branchOffice.$.noTelp": args['noTelp'],
            "branchOffice.$.email": args['email'],
            'change.updateUser': strUserData,
            'change.updateDate': current_date
        }
        valueVendor = {
            "$set": dataUpdate
        }
        updateVendor = commonVendor.updateVendor(filter=filter, value=valueVendor)
        if updateVendor['status'] == False:
            return updateVendor, 400
        return updateVendor, 200

class VendorEquipment(Resource):
    def post(self, vendor_id):
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if not resultVerify or role != 'admin':
            return {'status': False, 'message': 'Unauthorized.'}, 403
        
        parser = reqparse.RequestParser()
        parser.add_argument("equipmentCode")
        parser.add_argument("toolType")
        parser.add_argument("count")
        parser.add_argument("merk")
        parser.add_argument("condition")
        args = parser.parse_args()

        try:
            obj_id = ObjectId(vendor_id)
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID."}, 400

        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))

        filter = {'_id': obj_id}
        equipment = commonVendor.selectOneVendor(filter=filter)
        if not equipment.get('status') or equipment.get('data') is None:
            return {'status': False, 'message': 'Vendor tidak ditemukan.'}, 404

        equipmentCode = equipment.get('data').get('supportingEquipment', [])
        for equip in equipmentCode:
            if equip.get('equipmentCode') == args['equipmentCode']:
                return {'status': False, 'message': 'Equipment code sudah ada.'}, 400

        data = {
            "equipmentCode": args['equipmentCode'],
            "toolType": args['toolType'],
            "count": args['count'],
            "merk": args['merk'],
            "condition": args['condition']
        }
        dataUser = {
            'change.updateUser': strUserData,
            'change.updateDate': current_date
        }
        value = {
            "$set": dataUser,
            "$push": {"supportingEquipment": data}
        }
        updateVendor = commonVendor.updateVendor(filter=filter, value=value)
        if updateVendor['status'] == False:
            return updateVendor, 400
        return updateVendor, 200

    def put(self, vendor_id):
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if not resultVerify or role != 'admin':
            return {'status': False, 'message': 'Unauthorized.'}, 403
        
        parser = reqparse.RequestParser()
        parser.add_argument("equipmentCode")
        parser.add_argument("toolType")
        parser.add_argument("count")
        parser.add_argument("merk")
        parser.add_argument("condition")
        args = parser.parse_args()

        try:
            obj_id = ObjectId(vendor_id)
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID."}, 400

        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))

        filter = {'_id': obj_id, "supportingEquipment.equipmentCode": args['equipmentCode']}
        data = {
            "supportingEquipment.$.toolType": args['toolType'],
            "supportingEquipment.$.count": args['count'],
            "supportingEquipment.$.merk": args['merk'],
            "supportingEquipment.$.condition": args['condition'],
            'change.updateUser': strUserData,
            'change.updateDate': current_date
        }
        value = {
            "$set": data
        }
        updateVendor = commonVendor.updateVendor(filter=filter, value=value)
        
        if updateVendor['status'] == True:
            return updateVendor, 200
        return updateVendor, 400

    def delete(self, vendor_id):
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if not resultVerify or role != 'admin':
            return {'status': False, 'message': 'Unauthorized.'}, 403
       
        parser = reqparse.RequestParser()
        parser.add_argument("equipmentCode")
        parser.add_argument("args") 
        args = parser.parse_args()

        try:
            obj_id = ObjectId(vendor_id)
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID."}, 400

        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))
        dataUser = {
            'change.updateUser': strUserData,
            'change.updateDate': current_date
        }
        value = {
            "$set": dataUser,
            '$pull': {"supportingEquipment": {"equipmentCode": args['equipmentCode']}}
        }
        filter = {'_id': obj_id}
        vendor = commonVendor.updateVendor(filter=filter, value=value)
        if vendor['status'] == True:
            return vendor, 200
        return vendor, 400