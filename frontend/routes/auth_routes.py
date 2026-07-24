from flask import Blueprint, render_template, url_for, request, redirect, jsonify, make_response
import requests
import random, string
import logging

from common.connectredis import RedisClient
from common.decorator import check_guest
import config

auth_bp = Blueprint('auth', __name__)
commonRedis = RedisClient()
API_URL = config.API_URL

@auth_bp.route("/login", methods=['GET', 'POST'])
@check_guest
def login():
    strRandom = ''.join(random.choices(string.ascii_letters + string.digits, k=64))
    if request.method == 'POST':
        cookieData = request.cookies.get('KAPITA')
        data = request.json
        response = requests.post(url=f"{API_URL}/login", json=data, params={'sessionKey': cookieData})
        return make_response(jsonify(response.json()), response.status_code)
        
    response = make_response(render_template('auth/login.html'))
    response.set_cookie(key='KAPITA', value=strRandom)
    return response

@auth_bp.route("/register", methods=['GET', 'POST'])
@check_guest
def register():
    if request.method == 'POST':
        data = request.json
        response = requests.post(f"{API_URL}/register", json=data)
        return make_response(jsonify(response.json()), response.status_code)
    return render_template('auth/register.html')

@auth_bp.route("/forgot-password", methods=["POST", "PUT"])
@check_guest
def forgotPassword():
    if request.method == "POST":
        data = request.json
        response = requests.post(f"{API_URL}/forgot-password", json=data)
        return make_response(jsonify(response.json()), response.status_code)
    if request.method == 'PUT':
        data = request.json
        response = requests.put(f"{API_URL}/forgot-password", json=data)
        return make_response(response.json(), response.status_code)

@auth_bp.route("/logout")
def logout():
    cookieData = request.cookies.get('KAPITA')
    commonRedis.deleteCookieData(cookieData=cookieData)
    return redirect(url_for('auth.login'))