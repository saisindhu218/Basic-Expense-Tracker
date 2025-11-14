import jwt
from functools import wraps
from flask import request, jsonify
from app import mongo
from bson import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            from app import create_app
            app = create_app()
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
                
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def generate_token(user_id):
    from app import create_app
    app = create_app()
    token = jwt.encode(
        {'user_id': str(user_id)},
        app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )
    return token