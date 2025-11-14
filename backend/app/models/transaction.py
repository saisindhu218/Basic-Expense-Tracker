from flask_pymongo import PyMongo
from bson import ObjectId
from datetime import datetime
from app import mongo

class Transaction:
    @staticmethod
    def create_transaction(user_id, data):
        transaction = {
            'user_id': ObjectId(user_id),
            'amount': float(data['amount']),
            'description': data['description'],
            'category': data['category'],
            'type': data['type'],  # 'income' or 'expense'
            'date': datetime.strptime(data['date'], '%Y-%m-%d'),
            'created_at': datetime.utcnow()
        }
        result = mongo.db.transactions.insert_one(transaction)
        return str(result.inserted_id)
    
    @staticmethod
    def get_user_transactions(user_id):
        return list(mongo.db.transactions.find({'user_id': ObjectId(user_id)}).sort('date', -1))
    
    @staticmethod
    def get_transaction_by_id(transaction_id, user_id):
        return mongo.db.transactions.find_one({
            '_id': ObjectId(transaction_id),
            'user_id': ObjectId(user_id)
        })
    
    @staticmethod
    def update_transaction(transaction_id, user_id, data):
        update_data = {
            'amount': float(data['amount']),
            'description': data['description'],
            'category': data['category'],
            'type': data['type'],
            'date': datetime.strptime(data['date'], '%Y-%m-%d'),
            'updated_at': datetime.utcnow()
        }
        
        result = mongo.db.transactions.update_one(
            {
                '_id': ObjectId(transaction_id),
                'user_id': ObjectId(user_id)
            },
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    @staticmethod
    def delete_transaction(transaction_id, user_id):
        result = mongo.db.transactions.delete_one({
            '_id': ObjectId(transaction_id),
            'user_id': ObjectId(user_id)
        })
        return result.deleted_count > 0