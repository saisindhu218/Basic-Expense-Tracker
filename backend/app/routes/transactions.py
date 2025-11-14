from flask import Blueprint, request, jsonify
from app.models.transaction import Transaction
from app.utils.auth import token_required
from bson import ObjectId
import json

transactions_bp = Blueprint('transactions', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(JSONEncoder, self).default(obj)

@transactions_bp.route('/transactions', methods=['GET'])
@token_required
def get_transactions(current_user):
    try:
        transactions = Transaction.get_user_transactions(str(current_user['_id']))
        
        # Convert ObjectId to string for JSON serialization
        for transaction in transactions:
            transaction['_id'] = str(transaction['_id'])
            transaction['user_id'] = str(transaction['user_id'])
            transaction['date'] = transaction['date'].strftime('%Y-%m-%d')
            if 'created_at' in transaction:
                transaction['created_at'] = transaction['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        
        return jsonify(transactions), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@transactions_bp.route('/transactions', methods=['POST'])
@token_required
def create_transaction(current_user):
    try:
        data = request.get_json()
        
        required_fields = ['amount', 'description', 'category', 'type', 'date']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
        
        if data['type'] not in ['income', 'expense']:
            return jsonify({'message': 'Type must be income or expense'}), 400
        
        transaction_id = Transaction.create_transaction(str(current_user['_id']), data)
        
        return jsonify({
            'message': 'Transaction created successfully',
            'transaction_id': transaction_id
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@transactions_bp.route('/transactions/<transaction_id>', methods=['PUT'])
@token_required
def update_transaction(current_user, transaction_id):
    try:
        data = request.get_json()
        
        required_fields = ['amount', 'description', 'category', 'type', 'date']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400
        
        if data['type'] not in ['income', 'expense']:
            return jsonify({'message': 'Type must be income or expense'}), 400
        
        success = Transaction.update_transaction(transaction_id, str(current_user['_id']), data)
        
        if not success:
            return jsonify({'message': 'Transaction not found or unauthorized'}), 404
        
        return jsonify({'message': 'Transaction updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@transactions_bp.route('/transactions/<transaction_id>', methods=['DELETE'])
@token_required
def delete_transaction(current_user, transaction_id):
    try:
        success = Transaction.delete_transaction(transaction_id, str(current_user['_id']))
        
        if not success:
            return jsonify({'message': 'Transaction not found or unauthorized'}), 404
        
        return jsonify({'message': 'Transaction deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@transactions_bp.route('/summary', methods=['GET'])
@token_required
def get_summary(current_user):
    try:
        transactions = Transaction.get_user_transactions(str(current_user['_id']))
        
        total_income = 0
        total_expense = 0
        
        for transaction in transactions:
            if transaction['type'] == 'income':
                total_income += transaction['amount']
            else:
                total_expense += transaction['amount']
        
        balance = total_income - total_expense
        
        return jsonify({
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': balance
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500