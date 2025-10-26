# DriveMe API Documentation

## User Endpoints

### 1. POST /users/register

Register a new user in the system.

#### Request

- Method: `POST`
- URL: `/users/register`
- Content-Type: `application/json`

#### Request Body

```json
{
  "fullname": {
    "firstname": "string", // minimum 3 characters
    "lastname": "string"   // minimum 3 characters
  },
  "email": "string",
  "password": "string"
}
```

#### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| fullname.firstname | string | User's first name | Minimum 3 characters |
| fullname.lastname | string | User's last name | Minimum 3 characters |
| email | string | User's email address | Must be unique |
| password | string | User's password | Will be hashed before storage |

#### Responses

##### Success Response
- Status Code: `201 Created`
- Description: User successfully registered

Example Response:
```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null,
    "_id": "5f9d88b3b2b7c91234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Error Responses

###### Bad Request
- Status Code: `400 Bad Request`
- Description: Invalid input data

Example Response:
```json
{
  "errors": [
    {
      "msg": "firstname must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

###### Server Error
- Status Code: `500 Internal Server Error`
- Description: Server error occurred during registration

### 2. POST /users/login

Authenticate an existing user.

#### Request

- Method: `POST`
- URL: `/users/login`
- Content-Type: `application/json`

#### Request Body

```json
{
  "email": "string",
  "password": "string"     // minimum 6 characters
}
```

#### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| email | string | User's email address | Must be valid email format |
| password | string | User's password | Minimum 6 characters |

#### Responses

##### Success Response
- Status Code: `200 OK`
- Description: User successfully logged in
- Sets HTTP-only cookie with JWT token

Example Response:
```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null,
    "_id": "5f9d88b3b2b7c91234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Note: The token is both returned in the response and set as an HTTP-only cookie named 'token'

##### Error Responses

###### Invalid Credentials
- Status Code: `401 Unauthorized`
- Description: Invalid email or password

Example Response:
```json
{
  "errors": [
    {
      "msg": "Invalid email or password"
    }
  ]
}
```

###### Validation Error
- Status Code: `400 Bad Request`
- Description: Invalid input format

Example Response:
```json
{
  "errors": [
    {
      "msg": "email must be valid",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 3. GET /users/profile

Retrieve the authenticated user's profile information.

#### Request

- Method: `GET`
- URL: `/users/profile`
- Headers:
  - `Authorization`: Bearer {token}
  - Or uses Cookie: `token`

#### Authentication

This endpoint requires authentication. The JWT token must be provided either:
- In the Authorization header as a Bearer token
- In the cookies as 'token'

#### Responses

##### Success Response
- Status Code: `200 OK`
- Description: User profile retrieved successfully

Example Response:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "socketId": null,
  "_id": "5f9d88b3b2b7c91234567890"
}
```

##### Error Response
- Status Code: `401 Unauthorized`
- Description: Invalid or missing authentication token

Example Response:
```json
{
  "message": "Unauthorized user"
}
```

### 4. GET /users/logout

Log out the currently authenticated user and invalidate their token.

#### Request

- Method: `GET`
- URL: `/users/logout`
- Headers:
  - `Authorization`: Bearer {token}
  - Or uses Cookie: `token`

#### Authentication

This endpoint requires authentication. The JWT token must be provided either:
- In the Authorization header as a Bearer token
- In the cookies as 'token'

#### Responses

##### Success Response
- Status Code: `200 OK`
- Description: User successfully logged out

Example Response:
```json
{
  "message": "Logged out successfully"
}
```

##### Error Response
- Status Code: `401 Unauthorized`
- Description: Invalid or missing authentication token

Example Response:
```json
{
  "message": "Unauthorized user"
}
```

## Notes
- All passwords are hashed using bcrypt before storage
- JWT tokens are generated upon successful authentication
- Email addresses must be unique in the system
- Both firstname and lastname must be at least 3 characters long
- Password must be at least 6 characters long