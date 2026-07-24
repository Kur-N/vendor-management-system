from flask import Blueprint, render_template, request, jsonify, make_response
import requests

from common.connectredis import RedisClient
from common.decorator import login_required
import config

user_bp = Blueprint('user', __name__)
commonRedis = RedisClient()
API_URL = config.API_URL

@user_bp.route("/user", methods=['GET', 'POST'])
@login_required
def user():
    cookieData = request.cookies.get('KAPITA')
    sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        return make_response(jsonify({'message': "Unauthorized."}), 401)
        
    if request.method == 'POST':
        data = request.json
        response = requests.post(f"{API_URL}/user", json=data, params={'sessionKey': cookieData})
        return make_response(response.json(), response.status_code)
        
    response = requests.get(f"{API_URL}/user", params={'sessionKey': cookieData})
    return render_template('dashboard/user.html', data=response.json())

@user_bp.route("/user/<id>", methods=['PUT', 'DELETE'])
@login_required
def userById(id):
    cookieData = request.cookies.get('KAPITA')
    sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        return make_response(jsonify({'message': "Unauthorized."}), 401)
        
    if request.method == 'PUT':
        data = request.json
        response = requests.put(f"{API_URL}/user/{id}", json=data, params={'sessionKey': cookieData})
    else:
        response = requests.delete(f"{API_URL}/user/{id}", params={'sessionKey': cookieData})
    return make_response(response.json(), response.status_code)