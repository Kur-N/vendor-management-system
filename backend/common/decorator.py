from functools import wraps
from flask import request
from common.connectredis import RedisClient

commonRedis = RedisClient()

def admin_required(f):
    """
    Decorator untuk memastikan user sudah login (session valid) 
    dan memiliki role 'admin'.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Mengambil sessionKey dari query params atau headers (Authorization)
        sessionKey = request.args.get('sessionKey') or request.headers.get('Authorization')
        
        if not sessionKey:
            return {'status': False, 'message': 'Unauthorized: Session key is missing.'}, 401
            
        # Verifikasi sesi ke Redis
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        if not resultVerify:
            return {'status': False, 'message': 'Unauthorized: Invalid or expired session.'}, 403
            
        # Cek role admin
        role = commonRedis.getUserRole(sessionKey=sessionKey)
        if role != 'admin':
            return {'status': False, 'message': 'Forbidden: Admin access required.'}, 403
            
        return f(*args, **kwargs)
    return decorated_function


def login_required(f):
    """
    Decorator dasar hanya untuk memastikan user sudah login (tanpa batasan role admin).
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        sessionKey = request.args.get('sessionKey') or request.headers.get('Authorization')
        
        if not sessionKey:
            return {'status': False, 'message': 'Unauthorized: Session key is missing.'}, 401
            
        resultVerify = commonRedis.verifySession(sessionKey=sessionKey)
        if not resultVerify:
            return {'status': False, 'message': 'Unauthorized: Invalid or expired session.'}, 403
            
        return f(*args, **kwargs)
    return decorated_function