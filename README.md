# Inventory Management System

## Objective
The Inventory Management System is a backend API designed to support CRUD operations on inventory items, ensuring secure access through JWT-based authentication. 
It is built using Django Rest Framework (DRF), PostgreSQL for data storage, and Redis for caching. 
The system includes unit tests for reliability and integrates logging for debugging and monitoring.

## Background
An inventory management system helps businesses efficiently track and manage stock. 
The API provides endpoints for creating, reading, updating, and deleting inventory items. 
Redis caching enhances performance by reducing database load for frequently accessed items. Secure authentication is implemented using JWT tokens.

## Tech Stack
- **Frontend:** React (Hosted on Vercel)
- **Backend:** Django Rest Framework (DRF)
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Django’s built-in test framework (Unit Tests)
- **Logging:** Python’s logging module

## Features
- **CRUD Operations:** Manage inventory items efficiently.
- **Secure Authentication:** JWT-based authentication for API access.
- **Redis Caching:** Frequently accessed data is cached for improved performance.
- **Unit Testing:** Ensures the API functions correctly under different scenarios.
- **Logging:** Tracks API usage, errors, and significant events.

## Installation & Setup
### Prerequisites
- Python 3.8+
- PostgreSQL
- Redis
- Node.js & npm (for frontend)
- Virtual environment (recommended)

### Backend Setup
1. Clone the repository:
   
   git clone https://github.com/vaishnav80/Inventory-Mnagement
   cd backend
   
2. Create a virtual environment and activate it:
   
   python -m venv venv
   source venv/bin/activate  # On Windows use : venv\Scripts\activate
  
3. Install dependencies:
   
   pip install -r requirements.txt
   
4. Configure the `.env` file with PostgreSQL and Redis credentials.
5. Apply database migrations:
   
   python manage.py migrate
   
6. Start the Redis server:
   
   redis-server
   
7. Run the Django development server:
  
   python manage.py runserver
   

### Frontend Setup
1. Navigate to the frontend directory:
   
   cd frontend
   
2. Install dependencies:
   
   npm install
   
3. Start the React development server:
  
   npm start
 

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /register/ | Register a new user |
| POST   | /login/ | Authenticate a user and return JWT tokens |
| GET    | /manage/products/ | Retrieve all inventory items |
| POST   | /manage/products/ | Add a new item to the inventory |
| GET    | /manage/products/{id}/ | Retrieve a single inventory item |
| PATCH   | /manage/products/{id}/ | Update an existing inventory item |
| DELETE | /manage/products/{id}/ | Remove an item from the inventory |

## Testing
Run unit tests to verify API functionality:

python manage.py test


## Logging
Logging is integrated using Python’s logging module. Log levels include:
- INFO: General API usage
- DEBUG: Detailed information for debugging
- ERROR: Captures exceptions and failures

## Deployment
The frontend is hosted on **Vercel**, while the backend is deployed using Django with a PostgreSQL database and Redis caching.

