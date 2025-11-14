from flask_pymongo import PyMongo
from bson import ObjectId
import bcrypt
from app import mongo

class User:
    @staticmethod
    def create_user(username, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            'username': username,
            'email': email,
            'password': hashed_password
        }
        result = mongo.db.users.insert_one(user)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({'email': email})
    
    @staticmethod
    def find_by_id(user_id):
        return mongo.db.users.find_one({'_id': ObjectId(user_id)})
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)