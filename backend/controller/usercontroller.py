from flask_restful import Resource, reqparse
from flask_bcrypt import generate_password_hash, check_password_hash
from flask import request
from bson import ObjectId

from common.user import User
from common.connectredis import RedisClient
from common.decorator import admin_required

commonUser = User()
commonRedis = RedisClient()

class UserController(Resource):
    
    @admin_required
    def get(self, user_id=None):
        if user_id is None:
            response = commonUser.selectUser()
            if response.get('status') == True:
                return response, 200
            return response, 400
            
        filter = {'_id': ObjectId(user_id)}
        response = commonUser.selectOneUser(filter=filter)
        if response.get('status') == True:
            return response, 200
        return response, 400

    @admin_required
    def post(self):
        response = {
            'status': False,
            'message': '',
        }
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help="Username is required.")
        parser.add_argument('email', required=True, help="E-mail is required.")
        parser.add_argument('password', required=True, help="Password is required.")
        parser.add_argument('role', type=str, default="user", help="Role must be a string.")
        args = parser.parse_args()

        filterUsername = {'username': args['username']}
        username = commonUser.selectOneUser(filter=filterUsername)
        filterEmail = {'email': args['email']}
        email = commonUser.selectOneUser(filter=filterEmail)

        if username['data'] != None and email['data'] != None:
            response['message'] = 'Username and Email already exists.'
            return response, 400
        if username['data'] != None:
            response['message'] = 'Username already exists'
            return response, 400
        if email['data'] != None:
            response['message'] = 'Email already exists'
            return response, 409
        
        hashed_password = generate_password_hash(password=args['password']).decode('utf-8')
        data = {
            'username': args['username'],
            'email': args['email'],
            'password': hashed_password,
            'role': args['role']
        }
        new_user = commonUser.insertUser(value=data)
        response['message'] = new_user['message']

        if new_user['status'] == False:
            return response, 400
        return response, 201

    @admin_required
    def put(self, user_id):
        response = {
            'status': False,
            'message': '',
        }
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help="Username is required.")
        parser.add_argument('email', required=True, help="E-mail is required.")
        parser.add_argument('role', type=str, default="user", help="Role must be a string.")
        args = parser.parse_args()

        data = {
            'username': args['username'],
            'email': args['email'],
            'role': args['role']
        }
        filter = {'_id': ObjectId(user_id)}
        user = commonUser.updateUser(filter=filter, data=data)

        response['message'] = user['message']
        if user['status'] == True:
            return response, 200
        else:
            return response, 400

    @admin_required
    def delete(self, user_id):
        user = commonUser.deleteUser(id=ObjectId(user_id))
        if user.get('status') == True:
            return user, 200
        return user, 400

class CheckPassword(Resource):
    
    @admin_required
    def post(self, user_id):
        response = {
            'status': False,
            'message': '',
        }
        parser = reqparse.RequestParser()
        parser.add_argument('checkPassword', required=True, help="Password is required.")
        args = parser.parse_args()

        filterUser = {'_id': ObjectId(user_id)}
        user = commonUser.selectOneUser(filter=filterUser)

        if not user['status'] or not check_password_hash(user['data']['password'], args['checkPassword']):
            response['status'] = False
            response['message'] = 'Invalid credentials.'
            return response, 401
        
        response['status'] = True
        response['message'] = 'Valid credentials.'
        return response, 200