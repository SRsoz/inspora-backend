# Inspora Backend API

RESTful API for the Inspiration wall Inspora built with Node.js, Express, and MongoDB. This API integrates with Unsplash to provide a rich feed of inspirational images alongside user generated content.


## Table of Contents


- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Database Models](#database-models)


## Features


- User authentication with JWT tokens
- Role-based access control (User/Admin)
- Integration with Unsplash API for images
- User generated post management
- Combined feed of Unsplash and user content
- Search functionality with pagination
- Admin user management


## Tech Stack


- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **External API**: Unsplash API
- **Environment Management**: dotenv


## Getting Started


### Prerequisites


- Node.js (v14 or higher)
- MongoDB instance
- Unsplash API access key


### Installation


1. Clone the repository:
```bash
git clone <https://github.com/SRsoz/inspora-backend.git>
cd inspora-backend
```


2. Install dependencies:
```bash
npm install
```


3. Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))


4. Start the development server:
```bash
npm start
```


The API will be available at `http://localhost:4000`


## Environment Variables


Create a `.env` file in the root directory:


```env
MONGO_URI=mongodb+srv://SRsoz:Simba2015@inspora.upmpz18.mongodb.net/test
JWT_SECRET=superhemligt123
UNSPLASH_ACCESS_KEY=GNBsYDSItxt_EWXXLd7Avr5Iy-pamB-AXN-DiEITvDs
PORT=4000
```


## API Documentation


**Base URL**: `http://localhost:4000/api`


### Authentication Endpoints


| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |


#### Register User
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}

{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```


#### Login User
```json
{
  "email": "string",
  "password": "string"
}

{
  "token": "jwt_token",
  "user": { "id": "user_id", "username": "string", "email": "string", "role": "user" }
}
```

### Feed Endpoints


| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/feed?page=1&title=search` | Get combined feed | No |


**Query Parameters**: `page` (optional), `title` (optional, search term)


```json
{
  "feed": [
    {
      "id": "string",
      "title": "string",
      "imageUrl": "string",
      "source": "unsplash|user",
      "photographerName": "string",
      "user": "username"
    }
  ],
  "currentPage": 1,
  "totalPages": 10
}
```

### Post Endpoints


| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get all posts | Yes |
| GET | `/posts/:id` | Get single post | Yes |
| POST | `/posts` | Create new post | Yes |
| PUT | `/posts/:id` | Update post | Yes (owner/admin) |
| DELETE | `/posts/:id` | Delete post | Yes (owner/admin) |


#### Create Post
```json

{
  "title": "string",
  "imageUrl": "string"
}

{
  "_id": "post_id",
  "title": "string",
  "imageUrl": "string",
  "user": "user_id",
  "createdAt": "ISO_date",
  "updatedAt": "ISO_date"
}
```
#### Update Post
```json
// Request Body
{
  "title": "string",
  "imageUrl": "string"
}

```
#### Get Posts Response
```json
[
  {
    "_id": "post_id",
    "title": "string",
    "imageUrl": "string",
    "user": { "_id": "user_id", "username": "string" },
    "createdAt": "ISO_date",
    "updatedAt": "ISO_date"
  }
]
```

### User Management Endpoints (Admin Only)


| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Yes (admin) |
| GET | `/users/:id` | Get single user | Yes (admin) |
| PUT | `/users/:id` | Update user | Yes (admin) |
| DELETE | `/users/:id` | Delete user | Yes (admin) |


#### Update User
```json
// Request Body
{
  "username": "string",
  "email": "string",
  "role": "user|admin"
}

{
  "_id": "user_id",
  "username": "string",
  "email": "string",
  "role": "user",
  "updatedAt": "ISO_date"
}
```

#### Get Users Response
```json
// Response (200)
[
  {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user",
    "createdAt": "ISO_date"
  }
]
```
## Authentication
This API uses JWT for authentication. Include the token in the Authorization header:


```
Authorization: Bearer <your_jwt_token>
```

**Role-Based Access:**
- **User**: Can create, read, update, and delete their own posts
- **Admin**: Full access to all endpoints including user management

## Error Handling


Standard HTTP status codes are used:


| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |


**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

## Database Models


### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: "user", enum: ["user", "admin"]),
  createdAt: Date,
  updatedAt: Date
}
```


### Post Model
```javascript
{
  title: String (required),
  imageUrl: String (required),
  user: ObjectId (ref: "User", required),
  createdAt: Date,
  updatedAt: Date
}
