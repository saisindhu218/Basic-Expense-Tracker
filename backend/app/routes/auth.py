from flask import Blueprint, request, jsonify
from app.models.user import User
from app.utils.auth import generate_token
from bson import ObjectId
import json

auth_bp = Blueprint('auth', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(JSONEncoder, self).default(obj)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Registration data:", data)
        
        if not data or not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.find_by_email(data['email']):
            return jsonify({'message': 'User already exists'}), 400
        
        # Create user
        user_id = User.create_user(
            data['username'],
            data['email'],
            data['password']
        )
        
        token = generate_token(user_id)
        
        response_data = {
            'message': 'User created successfully',
            'token': token,
            'user_id': user_id,
            'username': data['username']
        }
        print("Registration success:", response_data)
        
        return jsonify(response_data), 201
        
    except Exception as e:
        print("Registration error:", str(e))
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login attempt for email:", data.get('email'))
        
        if not data or not all(key in data for key in ['email', 'password']):
            return jsonify({'message': 'Missing email or password'}), 400
        
        user = User.find_by_email(data['email'])
        print("User found:", user is not None)
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        password_valid = User.verify_password(user['password'], data['password'])
        print("Password valid:", password_valid)
        
        if not user or not password_valid:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        token = generate_token(str(user['_id']))
        
        response_data = {
            'message': 'Login successful',
            'token': token,
            'user_id': str(user['_id']),
            'username': user['username']
        }
        print("Login success:", {**response_data, 'token': f"{token[:20]}..."})
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({'message': str(e)}), 500