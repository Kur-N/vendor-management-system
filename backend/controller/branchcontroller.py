from flask_restful import Resource, reqparse
from flask import request
from bson import ObjectId
from datetime import datetime
import pytz

from common.connectredis import RedisClient
from common.vendor import Branch, Vendor
from common.decorator import login_required

commonRedis = RedisClient()
commonBranch = Branch()
commonVendor = Vendor()

class BranchController(Resource):
    @login_required
    def get(self, branch_id=None):
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
            
        if branch_id is None:
            response = commonBranch.selectBranch()
            if response.get('status') == True:
                return response, 200
            return response, 400
            
        filter = {'_id': branch_id}
        response = commonBranch.selectOneBranch(filter=filter)
        if response.get('status') == True:
            return response, 200
        return response, 400

    @login_required
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
        parser.add_argument("_id")
        parser.add_argument("activeStatus")
        parser.add_argument("BranchName")
        parser.add_argument("vendor_id")
        parser.add_argument("location")
        parser.add_argument("address")
        parser.add_argument("noTelp")
        parser.add_argument("email")
        args = parser.parse_args()
        
        filterBranchId = {'_id': args['_id']}
        branchId = commonBranch.selectOneBranch(filter=filterBranchId)
        filterBranchName = {'BranchName': args['BranchName']}
        branchName = commonBranch.selectOneBranch(filter=filterBranchName)
        
        if branchId.get('data') != None and branchName.get('data') != None:
            return {'status': False, 'message': "Kode Cabang dan Nama Cabang sudah ada."}, 400
        elif branchId.get('data') != None:
            return {'status': False, 'message': "Kode Cabang sudah ada."}, 400
        elif branchName.get('data') != None:
            return {'status': False, 'message': "Nama Cabang sudah ada."}, 400
            
        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))

        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        data = {
            '_id': args['_id'],
            'activeStatus': args['activeStatus'],
            'BranchName': args['BranchName'],
            'vendor_id': args['vendor_id'],
            'setup': {
                'createDate': current_date,
                'createUser': strUserData, 
                'updateUser': strUserData,
                'updateDate': current_date
            }
        }
        branch = commonBranch.insertBranch(data=data)
        if branch['status'] == False:
            return branch, 400
        
        branch_data = {
            "branchName": args['BranchName'],
            "location": args['location'],
            "address": args['address'],
            "noTelp": args['noTelp'],
            "email": args['email']
        }
        dataUser = {
            'change.updateUser': strUserData,
            'change.updateDate': current_date
        }
        
        try:
            vendor_obj_id = ObjectId(args['vendor_id'])
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID format."}, 400

        filter = {'_id': vendor_obj_id}
        value = {
            '$set': dataUser,
            '$addToSet': {"branchOffice": branch_data}
        }
        vendor = commonVendor.updateVendor(filter=filter, value=value)
        if vendor['status'] == False:
            return vendor, 400
            
        return {'status': True, 'message': "Berhasil menambahkan data Cabang"}, 201

    @login_required
    def put(self, branch_id):
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
        parser.add_argument("activeStatus")
        parser.add_argument("BranchName")
        parser.add_argument("vendor_id")
        args = parser.parse_args()

        filterBranchId = {'_id': branch_id}
        branchId = commonBranch.selectOneBranch(filter=filterBranchId)
        if not branchId.get('status') or branchId.get('data') is None:
            return {'status': False, 'message': 'Cabang tidak ditemukan.'}, 404

        old_branch_name = branchId.get('data').get('BranchName')
        if old_branch_name != args['BranchName']:
            filterBranchName = {'BranchName': args['BranchName']}
            checkBranchName = commonBranch.selectOneBranch(filter=filterBranchName)
            if checkBranchName.get('data') != None:
                return {'status': False, 'message': "Nama Cabang sudah ada."}, 400
        
        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))

        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        try:
            vendor_obj_id = ObjectId(args['vendor_id'])
        except Exception:
            return {'status': False, 'message': "Invalid Vendor ID format."}, 400

        filter_vendor = {'_id': vendor_obj_id, "branchOffice.branchName": old_branch_name}
        dataVendor = {
            "branchOffice.$.branchName": args['BranchName'],
            'change.updateUser': strUserData,
            'change.updateDate': current_date
        }
        valueVendor = {
            "$set": dataVendor
        }
        vendor = commonVendor.updateVendor(filter=filter_vendor, value=valueVendor)
        if vendor['status'] == False:
            return vendor, 400

        data = {
            'activeStatus': args['activeStatus'],
            'BranchName': args['BranchName'],
            'vendor_id': args['vendor_id'],
            'setup.updateUser': strUserData,
            'setup.updateDate': current_date
        }
        value = {
            '$set': data,
        }
        filter_branch = {'_id': branch_id}
        branch = commonBranch.updateBranch(filter=filter_branch, value=value)
        if branch['status'] == False:
            return branch, 400
        return branch, 200

    @login_required
    def delete(self, branch_id):
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
            
        filterBranchId = {'_id': branch_id}
        branchId = commonBranch.selectOneBranch(filter=filterBranchId)
        
        if branchId.get('status') == True and branchId.get('data') is not None:
            vendor_id = branchId.get('data').get('vendor_id')
            branchName = branchId.get('data').get('BranchName')
            
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
                '$pull': {"branchOffice": {"branchName": branchName}}
            }
            
            try:
                vendor_obj_id = ObjectId(vendor_id)
            except Exception:
                return {'status': False, 'message': "Invalid Vendor ID format."}, 400

            filter_vendor = {'_id': vendor_obj_id}
            vendor = commonVendor.updateVendor(filter=filter_vendor, value=value)
            if vendor['status'] == False:
                return vendor, 400
                
        branch = commonBranch.deleteBranch(id=branch_id)
        if branch['status'] == False:
            return branch, 400
        return branch, 200