from flask import Blueprint, render_template, request, jsonify, make_response
import requests

from common.connectredis import RedisClient
from common.decorator import login_required
import config

bank_bp = Blueprint('bank', __name__)
commonRedis = RedisClient()
API_URL = config.API_URL

@bank_bp.route("/get-bank")
@login_required
def getBank():
    cookieData = request.cookies.get('KAPITA')
    response = requests.get(f"{API_URL}/bank", params={'sessionKey': cookieData})
    return response.json(), response.status_code

@bank_bp.route("/bank", methods=['GET', 'POST'])
@login_required
def bank():
    cookieData = request.cookies.get('KAPITA')
    if request.method == 'POST':
        sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            return make_response(jsonify({'message': "Unauthorized."}), 401)
        data = request.json
        response = requests.post(f"{API_URL}/bank", json=data, params={'sessionKey': cookieData})
        return make_response(response.json(), response.status_code)

    response = requests.get(f"{API_URL}/bank", params={'sessionKey': cookieData})
    return render_template('dashboard/bank.html', data=response.json())

@bank_bp.route("/bank/<id>", methods=['DELETE', 'PUT'])
@login_required
def bankById(id):
    cookieData = request.cookies.get('KAPITA')
    sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        return make_response(jsonify({'message': "Unauthorized."}), 401)
        
    if request.method == 'PUT':
        data = request.json
        response = requests.put(f"{API_URL}/bank/{id}", json=data, params={'sessionKey': cookieData})
    else:
        response = requests.delete(f"{API_URL}/bank/{id}", params={'sessionKey': cookieData})
    return make_response(response.json(), response.status_code)