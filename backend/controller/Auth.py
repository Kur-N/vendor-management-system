from flask_restful import Resource, reqparse
from flask_bcrypt import generate_password_hash, check_password_hash
from flask import request
import logging
from common.user import User
from common.connectredis import RedisClient

commonUser = User()
commonRedis = RedisClient().getRedisConnection()

class UserRegistration(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help="Username is required.")
        parser.add_argument('email', required=True, help="E-mail is required.")
        parser.add_argument('password', required=True, help="Password is required.")
        parser.add_argument('role', type=str, default="user", help="Role must be a string.")
        args = parser.parse_args()
        
        response={
            'message':''
        }

        filterUsernmae = {'username':args['username']}
        username = commonUser.selectOneUser(filter=filterUsernmae)
        filterEmail = {'email':args['email']}
        email = commonUser.selectOneUser(filter=filterEmail)
        
        if username['data'] != None and email['data']:
            response['message'] = 'Username and Email already exists.'
            return response, 400
        if username['data'] != None:
            response['message'] = 'Username already exists'
            return response, 400
        if email['data'] !=  None:
            response['message'] = 'Email already exists'
            return response, 409

        hashed_password = generate_password_hash(password=args['password']).decode('utf-8')
        data = {
            'username':args['username'],
            'email':args['email'],
            'password':hashed_password,
            'role':args['role']
        }
        new_user = commonUser.insertUser(value=data)
        response['message'] = new_user['message']

        if new_user['status'] == False:
            return response, 400
        response['url']='/login'
        return response, 201
    
class UserLogin(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help="Username is required.")
        parser.add_argument('password', required=True, help="Password is required.")
        args = parser.parse_args()
        response = {
            'status': False, 
            'message':""
        }
        filterUser = {'username':args['username']}
        user = commonUser.selectOneUser(filter=filterUser)

        if not user['status'] or not check_password_hash(user['data']['password'], args['password']):
            response['status'] = False
            response['message'] = 'Invalid credentials.'
            return  response, 401
        user = user.get('data')

        sessionKey = request.args.get('sessionKey')
        commonRedis.hset(
            name=sessionKey,
            mapping={'username': user.get('username'), 'role': user.get('role')}
        )
        
        response['status'] = True
        response['message'] = 'Logged in successfully'
        response['url'] = '/dashboard'
        return response, 200

class ForgotPassword(Resource):
    # NOTE lebih baik POST atau GET
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('checkUsername', required=True, help="checkUsername is required.")
        args = parser.parse_args()
        response = {
            'message':''
        }

        filterUsername = {'username':args['checkUsername']}
        user = commonUser.selectOneUser(filter=filterUsername)
        if user.get('data') == None:
            response['message'] = 'Username not found.'
            return response, 404
        response['message'] = 'Username found'
        return response, 200
    
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('checkUsername', required=True, help="Username is required.")
        parser.add_argument('newPassword', required=True, help="Password is required.")
        args = parser.parse_args()

        hashed_password = generate_password_hash(password=args['newPassword']).decode('utf-8')
        data = {
            'password':hashed_password
        }
        
        response = {
            'message':''
        }
        filter = {'username':args['checkUsername']}
        user = commonUser.updateUser(filter=filter,data=data)
        response['message'] = user['message']
        if user['status'] == True:
            response['url'] = '/login'
            return response, 200
        else:
            return response, 400