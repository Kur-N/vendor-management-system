from flask_restful import Resource
from flask import request

from common.connectredis import RedisClient
from common.decorator import login_required

commonRedis = RedisClient()

class SessionController(Resource):
    @login_required
    def get(self):
        response = {
            'status': False,
            'message': '',
            'data': None
        }
        
        sessionKey = request.args.get('sessionKey')
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        
        if not resultVerify:
            response['status'] = False
            response['message'] = 'Unauthorized.'
            return response, 403
            
        # Mengambil cookie KAPITA yang dikirim dari client/frontend
        cookie_data = request.cookies.get('KAPITA')
        
        if not cookie_data:
            response['status'] = False
            response['message'] = 'Cookie KAPITA tidak ditemukan.'
            return response, 400
            
        # Ambil data dari Redis menggunakan cookie data sebagai key/parameter
        session_data, status = commonRedis.getCookieData(cookieData=cookie_data)
        
        if status:
            return {
                'status': True,
                'message': 'Berhasil get session data',
                'data': session_data
            }, 200
            
        response['status'] = False
        response['message'] = 'Gagal get session data atau sesi kedaluwarsa.'
        return response, 400