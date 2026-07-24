from flask import Blueprint, render_template, redirect, url_for, request
import requests
import logging

from common.connectredis import RedisClient
from common.decorator import login_required
import config

dashboard_bp = Blueprint('dashboard', __name__)
commonRedis = RedisClient()
API_URL = config.API_URL

@dashboard_bp.route("/dashboard", methods=['GET'])
@login_required
def dashboard():
    cookieData = request.cookies.get('KAPITA')
    try:
        vendor = requests.get(f"{API_URL}/vendor", params={'sessionKey': cookieData})
        branch = requests.get(f"{API_URL}/branch", params={'sessionKey': cookieData})
        bank = requests.get(f"{API_URL}/bank", params={'sessionKey': cookieData})
        user = requests.get(f"{API_URL}/user", params={'sessionKey': cookieData})
        
        return render_template('index.html', 
                               vendor=vendor.json(), 
                               branch=branch.json(), 
                               bank=bank.json(), 
                               user=user.json())
    except Exception as e:
        logging.error(f"Error fetching dashboard data: {e}")
        return render_template('index.html', vendor={}, branch={}, bank={}, user={})

@dashboard_bp.route("/session", methods=['GET'])
@login_required
def session():
    cookieData = request.cookies.get('KAPITA')
    sessionData, status = commonRedis.getCookieData(cookieData=cookieData)
    if status:
        return jsonify({'data': sessionData, 'message': "Berhasil get session data"}), 200
    return jsonify({'data': None, 'message': "Gagal get session data"}), 400