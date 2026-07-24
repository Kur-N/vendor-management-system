from flask import Blueprint, render_template, url_for, request, redirect, jsonify, make_response
import requests

from common.connectredis import RedisClient
from common.decorator import login_required
import config

vendor_bp = Blueprint('vendor', __name__)
commonRedis = RedisClient()
API_URL = config.API_URL

@vendor_bp.route("/get-vendor")
@login_required
def getVendor():
    cookieData = request.cookies.get('KAPITA')
    response = requests.get(f"{API_URL}/vendor", params={'sessionKey': cookieData})
    return response.json(), response.status_code
    
@vendor_bp.route("/vendor", methods=['GET', 'POST'])
@login_required
def vendor():
    cookieData = request.cookies.get('KAPITA')
    if request.method == 'POST':
        sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            return make_response(jsonify({'message': "Unauthorized."}), 401)
        data = request.json
        response = requests.post(f"{API_URL}/vendor", json=data, params={'sessionKey': cookieData})
        return make_response(response.json(), response.status_code)
        
    response = requests.get(f"{API_URL}/vendor", params={'sessionKey': cookieData})
    return render_template('vendor.html', data=response.json())

@vendor_bp.route("/vendor/<id>", methods=['GET', 'PUT', 'DELETE'])
@login_required
def vendorById(id):
    cookieData = request.cookies.get('KAPITA')
    if request.method in ['PUT', 'DELETE']:
        sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            return make_response(jsonify({'message': "Unauthorized."}), 401)
        data = request.json if request.method == 'PUT' else None
        if request.method == 'PUT':
            response = requests.put(f"{API_URL}/vendor/{id}", json=data, params={'sessionKey': cookieData})
        else:
            response = requests.delete(f"{API_URL}/vendor/{id}", params={'sessionKey': cookieData})
        return make_response(response.json(), response.status_code)
        
    response = requests.get(f"{API_URL}/vendor/{id}", params={'sessionKey': cookieData})
    if response.status_code in [400, 404]:
        return redirect(url_for('vendor.vendor'))
        
    return render_template("vendor-detail.html", data=response.json())

@vendor_bp.route("/vendor-equipment/<id>", methods=['POST', 'PUT', 'DELETE'])
@login_required
def vendorEquipment(id):
    cookieData = request.cookies.get('KAPITA')
    sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        return make_response(jsonify({'message': "Unauthorized."}), 401)
        
    data = request.json if request.method in ['POST', 'PUT'] else None
    if request.method == 'POST':
        response = requests.post(f"{API_URL}/vendor-equipment/{id}", json=data, params={'sessionKey': cookieData})
    elif request.method == 'PUT':
        response = requests.put(f"{API_URL}/vendor-equipment/{id}", json=data, params={'sessionKey': cookieData})
    else:
        response = requests.delete(f"{API_URL}/vendor-equipment/{id}", json=data, params={'sessionKey': cookieData})
    return make_response(response.json(), response.status_code)

@vendor_bp.route("/vendor-branch/<id>", methods=['PUT'])
@login_required
def vendorBranchById(id):
    cookieData = request.cookies.get('KAPITA')
    sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        return make_response(jsonify({'message': "Unauthorized."}), 401)
        
    data = request.json
    response = requests.put(f"{API_URL}/vendor-branch/{id}", json=data, params={'sessionKey': cookieData})
    return make_response(response.json(), response.status_code)

@vendor_bp.route("/branch", methods=['GET', 'POST'])
@login_required
def branch():
    cookieData = request.cookies.get('KAPITA')
    if request.method == 'POST':
        sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            return make_response(jsonify({'message': "Unauthorized."}), 401)
        data = request.json
        response = requests.post(f"{API_URL}/branch", json=data, params={'sessionKey': cookieData})
        return make_response(response.json(), response.status_code)
        
    response = requests.get(f"{API_URL}/branch", params={'sessionKey': cookieData})
    return render_template('branch.html', data=response.json())

@vendor_bp.route("/branch/<id>", methods=['PUT', 'DELETE'])
@login_required
def branchById(id):
    cookieData = request.cookies.get('KAPITA')
    sessionData, _ = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        return make_response(jsonify({'message': "Unauthorized."}), 401)
        
    if request.method == 'PUT':
        data = request.json
        response = requests.put(f"{API_URL}/branch/{id}", json=data, params={'sessionKey': cookieData})
    else:
        response = requests.delete(f"{API_URL}/branch/{id}", params={'sessionKey': cookieData})
    return make_response(response.json(), response.status_code)