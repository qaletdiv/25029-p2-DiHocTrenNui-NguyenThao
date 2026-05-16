# Backend Design & API Documentation

## 1. System Architecture & Backend Design Overview

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Token (JWT)
- **Architecture Pattern**: MVC (Model-View-Controller)
- **Data Storage**: File-based Mock Data (In-memory storage with relational structure)

### Core Design Principles
- **Separation of Concerns**: Logic is divided into Models (Data Access), Controllers (Business Logic), and Routes (Entry Points).
- **Relational Integrity**: Even with mock data, the system uses primary keys (IDs) and foreign keys to maintain relationships between Accounts, Students, Schools, and Transactions.
- **Role-Based Access Control (RBAC)**: A robust middleware handles authorization based on roles (Admin, Volunteer, Sponsor, Teacher) and specific action/resource permissions.

### Entity Relationships
- **Account**: Base entity for all users.
- **Student**: Linked to a **School** and potentially multiple **Sponsors** and **Volunteers**.
- **Bank Transaction**: Linked to a **Sponsor** and can be disbursed to multiple **Students**.

---

## 2. API Documentation

### Authentication

#### Login
- **Endpoint**: `POST /login`
- **Description**: Authenticate a user and receive a JWT token.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "thao@gmail.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "accessToken": "eyJhbG...",
      "user": {
        "id": 1,
        "email": "thao@gmail.com",
        "username": "thao.nguyen",
        "role_id": 1,
        "permissions": [...]
      }
    }
  }
  ```
- **Response (401 Unauthorized)**: Invalid credentials.

---

### Account Management

#### Get All Accounts
- **Endpoint**: `GET /accounts`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Array of account objects.

#### Create Account
- **Endpoint**: `POST /accounts`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "new.user",
    "email": "user@example.com",
    "password": "password123",
    "role_id": 2
  }
  ```

---

### Student Management

#### Get All Students
- **Endpoint**: `GET /students`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Array of student objects.

#### Create Student
- **Endpoint**: `POST /students`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "full_name": "Nguyen Van A",
    "date_of_birth": "2010-05-15",
    "address_id": 1,
    "school_id": 1,
    "situation": "Difficult",
    "status_id": 3
  }
  ```

---

### Bank Transactions

#### Get All Transactions
- **Endpoint**: `GET /bank-transactions`
- **Headers**: `Authorization: Bearer {{authToken}}`

#### Create Transaction
- **Endpoint**: `POST /bank-transactions`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "transfer_date": "2025-10-20",
    "amount": 1000000,
    "transfer_content": "Support for students",
    "status_id": 1
  }
  ```

---

---

### School Management

#### Get All Schools
- **Endpoint**: `GET /schools`
- **Headers**: `Authorization: Bearer {{authToken}}`

#### Create School
- **Endpoint**: `POST /schools`
- **Request Body**:
  ```json
  {
    "name": "Tiểu Học Hòa Bình",
    "address_id": 2,
    "phone": "02353123456"
  }
  ```

---

### Sponsor Management

#### Get All Sponsors
- **Endpoint**: `GET /sponsors`
- **Headers**: `Authorization: Bearer {{authToken}}`

#### Create Sponsor
- **Endpoint**: `POST /sponsors`
- **Request Body**:
  ```json
  {
    "full_name": "Nguyen Van B",
    "phone": "0905123456",
    "email": "vanb@gmail.com"
  }
  ```

---

## 3. Postman Testing Guide & Examples


### Environment Setup
1. Create a new Environment in Postman.
2. Add a variable `baseUrl` with value `http://localhost:5000`.
3. Add a variable `authToken` (leave current value empty).

### Automatic Token Saving
In the **Tests** tab of your **Login** request, paste the following snippet to automatically save the token for subsequent requests:

```javascript
const response = pm.response.json();
if (response.status === 'success') {
    pm.environment.set("authToken", response.data.accessToken);
}
```

### Example Requests

#### 1. Login (POST)
- **URL**: `{{baseUrl}}/login`
- **Body (raw JSON)**:
  ```json
  {
    "email": "thao@gmail.com",
    "password": "123"
  }
  ```

#### 2. Get Students (GET)
- **URL**: `{{baseUrl}}/students`
- **Auth**: `Bearer Token` -> `{{authToken}}`

#### 3. Update Account (PATCH)
- **URL**: `{{baseUrl}}/accounts/1`
- **Body (raw JSON)**:
  ```json
  {
    "username": "thao.updated"
  }
  ```

---

> [!TIP]
> Use the `{{baseUrl}}` variable to easily switch between local and production environments.
