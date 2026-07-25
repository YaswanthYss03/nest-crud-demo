# Student Management API Methods & Routes Documentation

This document provides a detailed reference of all API endpoints, HTTP methods, route parameters, request payloads, and response structures exclusively for the **Student Management System (`src/students`)**.

---

## Base URL
```
http://localhost:3000
```

---

## Student Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/students` | Register a new student record |
| `GET` | `/students` | Get all students (supports `search` & `department` query parameters) |
| `GET` | `/students/:id` | Get details of a specific student by ID |
| `PATCH` | `/students/:id` | Update student information by ID |
| `DELETE` | `/students/:id` | Remove a student record by ID |

---

## Detailed Endpoint Specifications

### 1. Register New Student
- **Method**: `POST`
- **Route**: `/students`
- **Headers**: `Content-Type: application/json`
- **Request Body (`CreateStudentDto`)**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Computer Science",
    "academicYear": 3,
    "cgpa": 3.85
  }
  ```
- **Validation Rules**:
  - `name`: `string`, non-empty (`@IsString()`, `@IsNotEmpty()`)
  - `email`: `string`, valid email format (`@IsEmail()`), unique in database
  - `department`: `string`, non-empty (`@IsString()`, `@IsNotEmpty()`)
  - `academicYear`: `integer` (`@IsInt()`, min: `1`, max: `6`)
  - `cgpa`: `number`/`float` (`@IsNumber()`, min: `0.0`, max: `10.0`)
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Computer Science",
    "academicYear": 3,
    "cgpa": 3.85,
    "createdAt": "2026-07-25T23:30:00.000Z",
    "updatedAt": "2026-07-25T23:30:00.000Z"
  }
  ```
- **Error Response (`400 Bad Request`)**:
  ```json
  {
    "statusCode": 400,
    "message": [
      "email must be an email",
      "cgpa must not be greater than 10"
    ],
    "error": "Bad Request"
  }
  ```

---

### 2. Get All Students (with Search & Department Filtering)
- **Method**: `GET`
- **Route**: `/students`
- **Query Parameters (Optional)**:
  - `search` (string): Case-insensitive search matched against student `name` or `email`.
  - `department` (string): Case-insensitive filter by `department`.
- **Example URL Requests**:
  - `GET http://localhost:3000/students`
  - `GET http://localhost:3000/students?search=john`
  - `GET http://localhost:3000/students?department=Computer%20Science`
  - `GET http://localhost:3000/students?search=john&department=Computer%20Science`
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "department": "Computer Science",
      "academicYear": 3,
      "cgpa": 3.85,
      "createdAt": "2026-07-25T23:30:00.000Z",
      "updatedAt": "2026-07-25T23:30:00.000Z"
    }
  ]
  ```

---

### 3. Get Student by ID
- **Method**: `GET`
- **Route**: `/students/:id`
- **Path Parameters**:
  - `id` (`integer`, required): Student primary key ID (parsed with `ParseIntPipe`).
- **Example Request**:
  - `GET http://localhost:3000/students/1`
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Computer Science",
    "academicYear": 3,
    "cgpa": 3.85,
    "createdAt": "2026-07-25T23:30:00.000Z",
    "updatedAt": "2026-07-25T23:30:00.000Z"
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "statusCode": 404,
    "message": "Student with ID 999 not found",
    "error": "Not Found"
  }
  ```

---

### 4. Update Student Information
- **Method**: `PATCH`
- **Route**: `/students/:id`
- **Path Parameters**:
  - `id` (`integer`, required): Student primary key ID.
- **Request Body (`UpdateStudentDto`)** *(All fields optional)*:
  ```json
  {
    "cgpa": 3.95,
    "academicYear": 4
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Computer Science",
    "academicYear": 4,
    "cgpa": 3.95,
    "createdAt": "2026-07-25T23:30:00.000Z",
    "updatedAt": "2026-07-25T23:38:00.000Z"
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "statusCode": 404,
    "message": "Student with ID 999 not found",
    "error": "Not Found"
  }
  ```

---

### 5. Delete Student Record
- **Method**: `DELETE`
- **Route**: `/students/:id`
- **Path Parameters**:
  - `id` (`integer`, required): Student primary key ID.
- **Example Request**:
  - `DELETE http://localhost:3000/students/1`
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Computer Science",
    "academicYear": 4,
    "cgpa": 3.95,
    "createdAt": "2026-07-25T23:30:00.000Z",
    "updatedAt": "2026-07-25T23:38:00.000Z"
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "statusCode": 404,
    "message": "Student with ID 999 not found",
    "error": "Not Found"
  }
  ```
