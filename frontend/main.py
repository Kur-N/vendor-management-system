from flask import Flask, render_template, url_for, request, redirect, jsonify, make_response, Response
import requests
import random, string
from bson.objectid import ObjectId
import logging

from common.connectredis import RedisClient
import config  # Memanggil file config.py yang baru kita buat

# 1. Inisialisasi Logging dari config
config.setup_logging()

# 2. Ambil URL Backend dari config
API_URL = config.API_URL

app = Flask(__name__)
commonRedis = RedisClient()

def loginCheck():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if resultCheck:
        return True
    return False

@app.route("/")
def index():
    return redirect(url_for('dashboard'))

@app.route("/dashboard", methods=['GET'])
def dashboard():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: #memastikan data ada di cookienya
        commonRedis.deleteCookieData(cookieData=cookieData)#memastikan sudh benr2 terdelete
        return redirect(url_for('login'))
    vendor = requests.get(f"{API_URL}/vendor",params={'sessionKey':cookieData})
    branch = requests.get(f"{API_URL}/branch",params={'sessionKey':cookieData})
    bank = requests.get(f"{API_URL}/bank",params={'sessionKey':cookieData})
    user = requests.get(f"{API_URL}/user",params={'sessionKey':cookieData})
    return render_template('index.html', vendor=vendor.json(), branch=branch.json(), bank=bank.json(), user=user.json())

@app.route("/logout")
def logout():
    cookieData = request.cookies.get('KAPITA')
    commonRedis.deleteCookieData(cookieData=cookieData)
    return redirect(url_for('login'))

@app.route("/login", methods=['GET','POST'])
def login():
    if loginCheck():
        return redirect(url_for('dashboard'))
    strRandom = ''.join(random.choices(string.ascii_letters+string.digits, k=64))
    if request.method == 'POST':
        cookieData = request.cookies.get('KAPITA')
        data = request.json
        response = requests.post(url=f"{API_URL}/login", json=data, params={'sessionKey':cookieData})
        return make_response(jsonify(response.json()), response.status_code)
    response = make_response(render_template('login.html'))
    response.set_cookie(key='KAPITA', value=strRandom)
    return response

@app.route("/register",methods=['GET',"POST"])
def register():
    if loginCheck():
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        data = request.json
        response = requests.post(f"{API_URL}/register", json=data)
        return make_response(jsonify(response.json()), response.status_code)
    return render_template('register.html')

@app.route("/forgot-password",methods=["POST","PUT"])
def forgotPassword():
    if loginCheck():
        return redirect(url_for('dashboard'))
    if request.method == "POST":
        data = request.json
        logging.info(f"data: {data}")
        response = requests.post(f"{API_URL}/forgot-password", json=data)
        logging.info(f"response:{response}")
        logging.info(f"response:{response.json()}")
        json_response = response.json()
        return make_response(jsonify(json_response), response.status_code)
    if request.method == 'PUT':
        data = request.json
        response = requests.put(f"{API_URL}/forgot-password", json=data)
        return make_response(response.json(), response.status_code)
    
@app.route("/session", methods=['GET'])
def session():
    cookieData = request.cookies.get('KAPITA')
    sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
    response = {
        'data': None,
        'message':''
    }
    if status == True:
        response['message'] = "Berhasil get session data"
        response['data'] = sessionData
        return jsonify(response), 200
    response['message'] = "Gagal get session data"
    return make_response(jsonify(response), 400)

@app.route("/get-vendor")
def getVendor():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = requests.get(f"{API_URL}/vendor",params={'sessionKey':cookieData})
    return response.json(), response.status_code
    
@app.route("/vendor", methods=['GET', 'POST'])
def vendor():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = {}
    if request.method == 'POST':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        data = request.json
        response = requests.post(f"{API_URL}/vendor", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    response = requests.get(f"{API_URL}/vendor", params={'sessionKey':cookieData})
    data = response.json()
    return render_template('vendor.html', data=data)

@app.route("/vendor/<id>", methods=['GET','PUT','DELETE'])
def vendorById(id):
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = {}
    if request.method == 'PUT':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        data = request.json
        response = requests.put(f"{API_URL}/vendor/{id}", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    if request.method == 'DELETE':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        response = requests.delete(f"{API_URL}/vendor/{id}", params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    try:
        ObjectId(id)
    except Exception as e:
        logging.error(f"Error ObjectId: {e}")
        # response['status'] = False
        # response['message'] = "Vendor Tidak ditemukan."
        # return redirect(url_for('vendor')), 404
        # redirect ke vendor
        response = Response(status=302)
        response.headers['Location'] = url_for('vendor')
        return response
    response = requests.get(f"{API_URL}/vendor/{id}", params={'sessionKey':cookieData})
    data = response.json()
    return render_template("vendor-detail.html", data=data)

@app.route("/vendor-equipment/<id>", methods=['POST','PUT','DELETE'])
def vendorEquipment(id):
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = {
        'message':''
    }
    sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        response['message'] = "Unauthorized."
        return make_response(jsonify(response), 401)
    if request.method == 'POST':
        data = request.json
        response = requests.post(f"{API_URL}/vendor-equipment/{id}", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    if request.method == 'PUT':
        data = request.json
        response = requests.put(f"{API_URL}/vendor-equipment/{id}", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    if request.method == 'DELETE':
        data = request.json
        response = requests.delete(f"{API_URL}/vendor-equipment/{id}", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)

@app.route("/vendor-branch/<id>", methods=['PUT'])
def vendorBranchById(id):
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = {}
    sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
    if sessionData.get('role') != 'admin':
        response['message'] = "Unauthorized."
        return make_response(jsonify(response), 401)
    data = request.json
    response = requests.put(f"{API_URL}/vendor-branch/{id}", json=data, params={'sessionKey':cookieData})
    return make_response(response.json(), response.status_code)

@app.route("/branch", methods=['GET','POST'])
def branch():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    if request.method == 'POST':
        response = {}
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        data = request.json
        response = requests.post(f"{API_URL}/branch", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    response = requests.get(f"{API_URL}/branch", params={'sessionKey':cookieData})
    data = response.json()
    return render_template('branch.html', data=data)

@app.route("/branch/<id>", methods=['PUT','DELETE'])
def branchById(id):
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = {
        'message':''
    }
    if request.method == 'PUT':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        data = request.json
        response = requests.put(f"{API_URL}/branch/{id}", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    if request.method == 'DELETE':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        response = requests.delete(f"{API_URL}/branch/{id}", params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)

@app.route("/get-bank")
def getBank():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = requests.get(f"{API_URL}/bank", params={'sessionKey':cookieData})
    return response.json(), response.status_code

@app.route("/bank", methods=['GET','POST'])
def bank():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = {}
    if request.method == 'POST':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        data = request.json
        response = requests.post(f"{API_URL}/bank", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)

    response = requests.get(f"{API_URL}/bank", params={'sessionKey':cookieData})
    data = response.json()
    return render_template('bank.html', data=data)

@app.route("/bank/<id>", methods=['DELETE','PUT'])
def bankById(id):
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    response = {}
    if request.method == 'PUT':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        data = request.json
        response = requests.put(f"{API_URL}/bank/{id}", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    if request.method == 'DELETE':
        sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
        if sessionData.get('role') != 'admin':
            response['message'] = "Unauthorized."
            return make_response(jsonify(response), 401)
        response = requests.delete(f"{API_URL}/bank/{id}", params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)

@app.route("/user", methods=['GET','POST'])
def user():
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
    response = {}
    if sessionData.get('role') != 'admin':
        response['message'] = "Unauthorized."
        return make_response(jsonify(response), 401)
    if request.method == 'POST':
        data = request.json
        response = requests.post(f"{API_URL}/user", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    response = requests.get(f"{API_URL}/user", params={'sessionKey':cookieData})
    data = response.json()
    return render_template('user.html', data=data)

@app.route("/user/<id>", methods=['PUT','DELETE'])
def userById(id):
    cookieData = request.cookies.get('KAPITA')
    resultCheck = commonRedis.checkCookieData(cookieData=cookieData)
    if not resultCheck: 
        commonRedis.deleteCookieData(cookieData=cookieData)
        return redirect(url_for('login'))
    sessionData,status = commonRedis.getCookieData(cookieData=cookieData)
    response = {}
    if sessionData.get('role') != 'admin':
        response['message'] = "Unauthorized."
        return make_response(jsonify(response), 401)
    if request.method == 'PUT':
        data = request.json
        response = requests.put(f"{API_URL}/user/{id}", json=data, params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)
    if request.method == 'DELETE':
        response = requests.delete(f"{API_URL}/user/{id}", params={'sessionKey':cookieData})
        return make_response(response.json(), response.status_code)

if __name__ == '__main__':
    app.run(debug=True)