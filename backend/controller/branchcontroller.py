from flask_restful import Resource, reqparse
from flask import request
from bson import ObjectId
from datetime import datetime
import pytz

from common.connectredis import RedisClient
from common.vendor import Branch, Vendor

commonRedis = RedisClient()
commonBranch = Branch()
commonVendor = Vendor()

class BranchController(Resource):
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
        filter={'_id':branch_id}
        response = commonBranch.selectOneBranch(filter=filter)
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
        parser.add_argument("_id")
        parser.add_argument("activeStatus")
        parser.add_argument("BranchName")
        parser.add_argument("vendor_id")
        parser.add_argument("location")
        parser.add_argument("address")
        parser.add_argument("noTelp")
        parser.add_argument("email")
        args = parser.parse_args()
        response = {
            'message':''
        }
        filterBranchId = {'_id':args['_id']}
        branchId = commonBranch.selectOneBranch(filter=filterBranchId)
        filterBranchName = {'BranchName':args['BranchName']}
        branchName = commonBranch.selectOneBranch(filter=filterBranchName)
        if branchId.get('data') != None and branchName.get('data') != None:
            response['message'] = "Kode Cabang dan Nama Cabang sudah ada."
            return response, 400
        elif branchId.get('data') != None:
            response['message'] = "Kode Cabang sudah ada."
            return response, 400
        elif branchName.get('data') != None:
            response['message'] = "Nama Cabang sudah ada."
            return response, 400
        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))

        # ambil data username dari session
        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        data = {
            '_id':args['_id'],
            'activeStatus':args['activeStatus'],
            'BranchName':args['BranchName'],
            'vendor_id':args['vendor_id'],
            'setup':{
                'createDate':current_date,
                'createUser':strUserData, 
                'updateUser':strUserData,
                'updateDate':current_date
            }
        }
        branch = commonBranch.insertBranch(data=data)
        print(f"branch:{branch}")
        response['message'] = branch['message']

        if branch['status'] == False:
            return response,400
        
        branch_data = {
            "branchName":args['BranchName'],
            "location":args['location'],
            "address":args['address'],
            "noTelp":args['noTelp'],
            "email":args['email']
        }
        dataUser = {
            'change.updateUser':strUserData,
            'change.updateDate':current_date
        }
        filter = {'_id':ObjectId(args['vendor_id'])}
        value = {
            '$set':dataUser,
            '$addToSet':{"branchOffice":branch_data}
        }
        vendor = commonVendor.updateVendor(filter=filter,value=value)
        response['message'] = vendor['message']
        if vendor['status'] == False:
            return response,400
        response['message']= "Berhasil menambahkan data Cabang"
        return response,201

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

        response = {
            'message':''
        }

        # cari data branch
        filterBranchId = {'_id':branch_id}
        branchId = commonBranch.selectOneBranch(filter=filterBranchId)
        branchName = branchId.get('data').get('BranchName')
        if branchName != args['BranchName']:
            filterBranchName = {'BranchName':args['BranchName']}
            checkBranchName = commonBranch.selectOneBranch(filter=filterBranchName)
            if checkBranchName.get('data') != None:
                response['message'] = "Nama Cabang sudah ada."
                return response, 400
        
        timezone = pytz.timezone("Asia/Jakarta")
        current_date = str(datetime.now(timezone))

        # ambil data username dari session
        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        filter = {'_id':ObjectId(args['vendor_id']), "branchOffice.branchName":branchName}
        dataVendor = {
            "branchOffice.$.branchName":args['BranchName'],
            'change.updateUser':strUserData,
            'change.updateDate':current_date
        }
        valueVendor = {
            "$set":dataVendor
        }
        vendor = commonVendor.updateVendor(filter=filter, value=valueVendor)
        if vendor['status'] == False:
            return vendor, 400

        data = {
            'activeStatus':args['activeStatus'],
            'BranchName':args['BranchName'],
            'vendor_id':args['vendor_id'],
            'setup.updateUser':strUserData,
            'setup.updateDate':current_date
        }
        value = {
            '$set': data,
        }
        filter = {'_id':branch_id}
        branch = commonBranch.updateBranch(filter=filter,value=value)
        response['message'] = branch['message']
        if branch['status'] == False:
            return response, 400
        return response, 200

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
        # cari data cabang
        filterBranchId = {'_id':branch_id}
        branchId = commonBranch.selectOneBranch(filter=filterBranchId)
        print(f"branchid= {branchId}")
        if branchId.get('status') == True:
            vendor_id = branchId.get('data').get('vendor_id')
            branchName = branchId.get('data').get('BranchName')
            print(f"branchName: {branchName}")
            print(f"branch:{branch_id}")
            userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
            strUserData = userData.decode("utf-8")

            timezone = pytz.timezone("Asia/Jakarta")
            current_date = str(datetime.now(timezone))
            dataUser = {
                'change.updateUser':strUserData,
                'change.updateDate':current_date
            }
            value = {
                "$set":dataUser,
                '$pull':{ "branchOffice" : {"branchName":branchName}}
            }
            filter = {'_id':ObjectId(vendor_id)}
            vendor = commonVendor.updateVendor(filter=filter,value=value)
            print(f"vendor:{vendor}")
            if vendor['status'] == False:
                return vendor, 400
        branch = commonBranch.deleteBranch(id=branch_id)
        if branch['status'] == False:
            return branch, 400
        return branch, 200