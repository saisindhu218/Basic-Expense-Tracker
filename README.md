# 💰 Expense Tracker

A full-stack web application for managing personal finances built with Flask, React, and MongoDB.

## 🚀 Features

- **User Authentication** - Secure registration and login with JWT
- **Transaction Management** - Add, edit, delete income and expenses
- **Real-time Balance** - Automatic balance calculation
- **Category Organization** - Categorize transactions (food, rent, bills, etc.)
- **Indian Rupee Support** - Currency formatted for Indian users

## 🛠️ Tech Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Flask, Python, JWT Authentication
- **Database**: MongoDB
- **Styling**: Custom CSS

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js
- MongoDB

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/summary` | Financial summary |

## 🎯 Usage

1. Register a new account
2. Login with your credentials
3. Add income and expense transactions
4. View your financial summary and balance
5. Edit or delete transactions as needed

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Auth utilities
│   ├── tests/               # Test cases
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API calls
│   │   └── utils/           # Auth helpers
│   └── package.json
└── README.md
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
```

## 🎯 Why This README Works:

✅ **Clean and professional**  
✅ **Easy to understand**  
✅ **Clear installation instructions**  
✅ **API documentation**  
✅ **Project structure overview**  
✅ **Feature highlights**  
✅ **Tech stack visibility**  

## 📝 To Use This:

1. **Create a new file** called `README.md` in your project root
2. **Copy and paste** the content above
3. **Save the file**
4. **Commit and push** to GitHub

## Rachabattuni Sai Sindhu
