from flask_restful import Resource, reqparse
from flask import request
from datetime import datetime
import pytz

from common.connectredis import RedisClient
from common.vendor import Bank, Vendor

commonVendor = Vendor()
commonBank = Bank()
commonRedis = RedisClient()

class BankController(Resource):
    def get(self, bank_id=None):
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
        if bank_id is None:
            response = commonBank.selectBank()
            if response.get('status') == True:
                return response, 200
            return response, 400
        filter={'_id':bank_id}
        response = commonBank.selectOneBank(filter=filter)
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
        parser.add_argument("bankName")
        parser.add_argument("activeStatus")
        parser.add_argument("bankDesc")
        args = parser.parse_args()
        response = {
            'message':''
        }
        
        # ambil data username dari session
        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")
        
        timezone = pytz.timezone('Asia/Jakarta')
        current_date = str(datetime.now(timezone))
        data = {
            '_id':args['bankName'],
            'activeStatus':args['activeStatus'],
            'bankDesc':args['bankDesc'],
            'setup':{
                'createDate':current_date,
                'createUser':strUserData, #ambil dari session
                'updateUser':strUserData,
                'updateDate':current_date
            }
        }
        bank = commonBank.insertBank(data=data)
        response['message'] = bank.get('message')
        if bank.get('status') == False:
            return response, 400
        return response, 201

    def put(self, bank_id):
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
        parser.add_argument("bankDesc")
        args = parser.parse_args()
        response = {
            'message':''
        }

        # ambil data username dari session
        userData = commonRedis.getRedisConnection().hget(sessionKey, b'username')
        strUserData = userData.decode("utf-8")

        timezone = pytz.timezone('Asia/Jakarta')
        current_date = str(datetime.now(timezone))
        data = {
            'activeStatus':args['activeStatus'],
            'bankDesc':args['bankDesc'],
            'setup.updateUser':strUserData, #ambil dari session
            'setup.updateDate':current_date
        }
        value = {
            '$set':data
        }
        bank = commonBank.updateBank(id=bank_id, value= value)
        response['message'] = bank['message']
        if bank.get('status') == True:
            return response, 200
        return response, 400

    def delete(self, bank_id):
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
        bank = commonBank.deleteBank(id=bank_id)
        if bank.get('status') == True:
            return bank, 200
        return bank, 400