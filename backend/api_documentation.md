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

### Standard Pagination
All `GET /entities` endpoints (e.g., `/students`, `/sponsors`) support server-side pagination via query parameters:
- `page` (optional): The page number to fetch (default: `1`).
- `pageSize` (optional): The number of records per page (default: all records).

**Example Request:** `GET /students?page=1&pageSize=10`

**Standard Paginated Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "dataKey": [...], 
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```
*(Where `dataKey` is the plural entity name, e.g., `"students"`, `"schools"`, `"sponsors"`).*

---

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

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `USER`.

#### Get All Accounts
- **Endpoint**: `GET /accounts` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of account objects in the `accounts` field.

#### Get Account by ID
- **Endpoint**: `GET /accounts/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single account object.
- **Response (404 Not Found)**: Account not found.

#### Create Account
- **Endpoint**: `POST /accounts`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `username`, `email`, `password`, `role_id`
- **Request Body**:
  ```json
  {
    "username": "new.user",
    "email": "user@example.com",
    "password": "password123",
    "role_id": 2
  }
  ```
- **Notes**: Duplicate check on `email`. `is_active` is automatically set to `true`.
- **Response (201 Created)**: Newly created account object.
- **Response (400 Bad Request)**: Validation failed or email already exists.

#### Update Account
- **Endpoint**: `PATCH /accounts/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "username": "updated.user",
    "email": "updated@example.com"
  }
  ```
- **Response (200 OK)**: Updated account object.
- **Response (404 Not Found)**: Account not found.

#### Delete Account
- **Endpoint**: `DELETE /accounts/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "status": "success", "message": "Account deleted successfully" }`
- **Response (404 Not Found)**: Account not found.

---

### Student Management

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `STUDENT`.

#### Get All Students
- **Endpoint**: `GET /students` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of student objects in the `students` field.

#### Get Student by ID
- **Endpoint**: `GET /students/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single student object.
- **Response (404 Not Found)**: Student not found.

#### Create Student
- **Endpoint**: `POST /students`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `full_name`, `address_id`, `date_of_birth`, `situation`, `status_id`, `school_id`
- **Request Body**:
  ```json
  {
    "full_name": "Nguyen Van A",
    "date_of_birth": "2010-05-15",
    "address_id": 1,
    "school_id": 1,
    "situation": "Difficult",
    "status_id": 3,
    "monthly_amount": 500000
  }
  ```
- **Notes**: `monthly_amount` defaults to `500000` if omitted. Duplicate check on `full_name + address_id + date_of_birth`.
- **Response (201 Created)**: Newly created student object.
- **Response (400 Bad Request)**: Validation failed or student already exists.

#### Update Student
- **Endpoint**: `PATCH /students/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "situation": "Stable",
    "status_id": 1,
    "monthly_amount": 600000
  }
  ```
- **Response (200 OK)**: Updated student object.
- **Response (404 Not Found)**: Student not found.

#### Delete Student
- **Endpoint**: `DELETE /students/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "status": "success", "message": "Student deleted successfully" }`
- **Response (404 Not Found)**: Student not found.

---

### Bank Transactions

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `BANK_TRANSACTION`.

#### Get All Transactions
- **Endpoint**: `GET /bank-transactions` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of transaction objects in the `transactions` field.

#### Get Transaction by ID
- **Endpoint**: `GET /bank-transactions/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single transaction object.
- **Response (404 Not Found)**: Transaction not found.

#### Create Transaction
- **Endpoint**: `POST /bank-transactions`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `transfer_date`, `amount`, `transfer_content`, `status_id`
- **Request Body**:
  ```json
  {
    "transfer_date": "2025-10-20",
    "amount": 1000000,
    "transfer_content": "Support for students",
    "status_id": 1
  }
  ```
- **Notes**: `amount` must be a number.
- **Response (201 Created)**: Newly created transaction object.
- **Response (400 Bad Request)**: Validation failed (e.g. `amount` is not a number).

#### Update Transaction
- **Endpoint**: `PATCH /bank-transactions/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "amount": 1500000,
    "status_id": 2
  }
  ```
- **Response (200 OK)**: Updated transaction object.
- **Response (404 Not Found)**: Transaction not found.

#### Delete Transaction
- **Endpoint**: `DELETE /bank-transactions/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "status": "success", "message": "Transaction deleted successfully" }`
- **Response (404 Not Found)**: Transaction not found.

---

### School Management

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `SCHOOL`.

#### Get All Schools
- **Endpoint**: `GET /schools` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of school objects in the `schools` field.

#### Get School by ID
- **Endpoint**: `GET /schools/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single school object.
- **Response (404 Not Found)**: School not found.

#### Create School
- **Endpoint**: `POST /schools`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `name`, `address`, `teacher_id`
- **Request Body**:
  ```json
  {
    "name": "Tiểu Học Hòa Bình",
    "address": "Xã Hòa Bình, Huyện Tương Dương",
    "teacher_id": 3
  }
  ```
- **Notes**: Duplicate check on `name`.
- **Response (201 Created)**: Newly created school object.
- **Response (400 Bad Request)**: Validation failed or school name already exists.

#### Update School
- **Endpoint**: `PATCH /schools/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "address": "Xã Mới, Huyện Tương Dương"
  }
  ```
- **Response (200 OK)**: Updated school object.
- **Response (404 Not Found)**: School not found.

#### Delete School
- **Endpoint**: `DELETE /schools/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "status": "success", "message": "School deleted successfully" }`
- **Response (404 Not Found)**: School not found.

---

### Sponsor Management

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `SPONSOR`.

#### Get All Sponsors
- **Endpoint**: `GET /sponsors` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of sponsor objects in the `sponsors` field.

#### Get Sponsor by ID
- **Endpoint**: `GET /sponsors/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single sponsor object.
- **Response (404 Not Found)**: Sponsor not found.

#### Create Sponsor
- **Endpoint**: `POST /sponsors`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `name`, `contact_info`, `status_id`, `volunteer_id`
- **Request Body**:
  ```json
  {
    "name": "Nguyen Van B",
    "contact_info": "0905123456",
    "status_id": 1,
    "volunteer_id": 2
  }
  ```
- **Notes**: Duplicate check on `name` (via `findByFullName`).
- **Response (201 Created)**: Newly created sponsor object.
- **Response (400 Bad Request)**: Validation failed or sponsor name already exists.

#### Update Sponsor
- **Endpoint**: `PATCH /sponsors/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "contact_info": "0905999888",
    "status_id": 2
  }
  ```
- **Response (200 OK)**: Updated sponsor object.
- **Response (404 Not Found)**: Sponsor not found.

#### Delete Sponsor
- **Endpoint**: `DELETE /sponsors/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "status": "success", "message": "Sponsor deleted successfully" }`
- **Response (404 Not Found)**: Sponsor not found.

---

### Image Management

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `IMAGE`.

#### Get All Images
- **Endpoint**: `GET /images` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of image objects in the `images` field.

#### Get Image by ID
- **Endpoint**: `GET /images/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single image object.
- **Response (404 Not Found)**: Image not found.

#### Get Images by Student
- **Endpoint**: `GET /images/student/:studentId`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Description**: Returns all images associated with a specific student.
- **Response (200 OK)**: Array of image objects for that student.

#### Get Images by Time Range
- **Endpoint**: `GET /images/range`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Query Parameters**:
  | Param | Type   | Required | Description             |
  |-------|--------|----------|-------------------------|
  | start | string | Yes      | Start date (YYYY-MM-DD) |
  | end   | string | Yes      | End date (YYYY-MM-DD)   |
- **Example**: `GET /images/range?start=2025-01-01&end=2025-12-31`
- **Response (200 OK)**: Array of image objects within the date range.
- **Response (400 Bad Request)**: `start` or `end` query param is missing.

#### Create Image
- **Endpoint**: `POST /images`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `student_id`, `url`, `timestamp`
- **Request Body**:
  ```json
  {
    "student_id": 1,
    "url": "https://storage.example.com/images/abc.jpg",
    "timestamp": "2025-10-20T08:00:00Z",
    "metadata": {}
  }
  ```
- **Notes**: `metadata` defaults to `{}` if omitted.
- **Response (201 Created)**: Newly created image object.
- **Response (400 Bad Request)**: Validation failed.

#### Update Image
- **Endpoint**: `PATCH /images/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "url": "https://storage.example.com/images/updated.jpg"
  }
  ```
- **Response (200 OK)**: Updated image object.
- **Response (404 Not Found)**: Image not found.

#### Delete Image
- **Endpoint**: `DELETE /images/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "status": "success", "message": "Image deleted successfully" }`
- **Response (404 Not Found)**: Image not found.

---

### Teacher Management

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `TEACHER`.

#### Get All Teachers
- **Endpoint**: `GET /teachers` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of teacher objects in the `teachers` field.

#### Get Teacher by ID
- **Endpoint**: `GET /teachers/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single teacher object.
- **Response (404 Not Found)**: Teacher not found.

#### Create Teacher
- **Endpoint**: `POST /teachers`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `account_id`, `school_id`, `full_name`, `phone`, `email`, `gender`
- **Request Body**:
  ```json
  {
    "account_id": 10,
    "school_id": 1,
    "full_name": "Ngoc Thu",
    "phone": "0905458294",
    "email": "thu@gmail.com",
    "gender": "Female"
  }
  ```
- **Response (201 Created)**: Newly created teacher object.
- **Response (400 Bad Request)**: Validation failed or invalid email format.

#### Update Teacher
- **Endpoint**: `PATCH /teachers/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "phone": "0905999888"
  }
  ```
- **Response (200 OK)**: Updated teacher object.
- **Response (404 Not Found)**: Teacher not found.

#### Delete Teacher
- **Endpoint**: `DELETE /teachers/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "success": true, "message": "Teacher deleted successfully" }`
- **Response (404 Not Found)**: Teacher not found.

---

### Volunteer Management

> **Permission**: Requires `READ / CREATE / UPDATE / DELETE` on resource `VOLUNTEER`.

#### Get All Volunteers
- **Endpoint**: `GET /volunteers` (Supports pagination `?page=&pageSize=`)
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Standard Paginated Response containing an array of volunteer objects in the `volunteers` field.

#### Get Volunteer by ID
- **Endpoint**: `GET /volunteers/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: Single volunteer object.
- **Response (404 Not Found)**: Volunteer not found.

#### Create Volunteer
- **Endpoint**: `POST /volunteers`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Required Fields**: `account_id`, `full_name`, `phone`, `email`, `gender`
- **Request Body**:
  ```json
  {
    "account_id": 2,
    "full_name": "Vu Lien",
    "phone": "0905222222",
    "email": "lien@gmail.com",
    "gender": "Female"
  }
  ```
- **Response (201 Created)**: Newly created volunteer object.
- **Response (400 Bad Request)**: Validation failed or invalid email format.

#### Update Volunteer
- **Endpoint**: `PATCH /volunteers/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`
- **Note**: All fields are optional for partial update.
- **Request Body**:
  ```json
  {
    "phone": "0901999888"
  }
  ```
- **Response (200 OK)**: Updated volunteer object.
- **Response (404 Not Found)**: Volunteer not found.

#### Delete Volunteer
- **Endpoint**: `DELETE /volunteers/:id`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Response (200 OK)**: `{ "success": true, "message": "Volunteer deleted successfully" }`
- **Response (404 Not Found)**: Volunteer not found.

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

#### 4. Get Images by Student (GET)
- **URL**: `{{baseUrl}}/images/student/1`
- **Auth**: `Bearer Token` -> `{{authToken}}`

#### 5. Get Images by Date Range (GET)
- **URL**: `{{baseUrl}}/images/range?start=2025-01-01&end=2025-12-31`
- **Auth**: `Bearer Token` -> `{{authToken}}`

---

> [!TIP]
> Use the `{{baseUrl}}` variable to easily switch between local and production environments.
