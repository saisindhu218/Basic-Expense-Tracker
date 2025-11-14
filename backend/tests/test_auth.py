import pytest
import json
from app import create_app
from app.models.user import User

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register_user(client):
    user_data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpassword'
    }
    
    response = client.post('/api/auth/register', 
                         data=json.dumps(user_data),
                         content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'token' in data
    assert 'user_id' in data

def test_login_user(client):
    # First register a user
    user_data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpassword'
    }
    client.post('/api/auth/register', 
               data=json.dumps(user_data),
               content_type='application/json')
    
    # Then try to login
    login_data = {
        'email': 'test@example.com',
        'password': 'testpassword'
    }
    
    response = client.post('/api/auth/login',
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'token' in data
    assert data['username'] == 'testuser'