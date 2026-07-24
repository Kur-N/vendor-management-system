from functools import wraps
from flask import request, redirect, url_for, jsonify, make_response
from common.connectredis import RedisClient

commonRedis = RedisClient()

def login_required(f):
    """Decorator untuk memastikan user sudah memiliki cookie/session yang valid."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        cookieData = request.cookies.get('KAPITA')
        if not cookieData or not commonRedis.checkCookieData(cookieData=cookieData):
            commonRedis.deleteCookieData(cookieData=cookieData)
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator untuk memastikan user yang login memiliki role 'admin'."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        cookieData = request.cookies.get('KAPITA')
        if not cookieData or not commonRedis.checkCookieData(cookieData=cookieData):
            return redirect(url_for('login'))
        
        sessionData, status = commonRedis.getCookieData(cookieData=cookieData)
        if not status or sessionData.get('role') != 'admin':
            return make_response(jsonify({'message': 'Unauthorized.'}), 401)
            
        return f(*args, **kwargs)
    return decorated_function

def check_guest(f):
    """Mencegah user yang sudah login untuk mengakses halaman login/register/forgot-password."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        cookieData = request.cookies.get('KAPITA')
        if cookieData and commonRedis.checkCookieData(cookieData=cookieData):
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function