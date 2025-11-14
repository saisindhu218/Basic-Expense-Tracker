
import pytest
import json
import jwt
from app import create_app
from app.models.user import User
from app.models.transaction import Transaction

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    with app.test_client() as client:
        yield client

@pytest.fixture
def auth_token(client):
    user_data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpassword'
    }
    client.post('/api/auth/register', 
               data=json.dumps(user_data),
               content_type='application/json')
    
    login_data = {
        'email': 'test@example.com',
        'password': 'testpassword'
    }
    response = client.post('/api/auth/login',
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    data = json.loads(response.data)
    return data['token']

def test_create_transaction(client, auth_token):
    transaction_data = {
        'amount': 100.50,
        'description': 'Test transaction',
        'category': 'food',
        'type': 'expense',
        'date': '2023-12-01'
    }
    
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    
    response = client.post('/api/transactions',
                          data=json.dumps(transaction_data),
                          headers=headers)
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'transaction_id' in data

def test_get_transactions(client, auth_token):
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    
    response = client.get('/api/transactions', headers=headers)
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)