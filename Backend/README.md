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

## Notes
- All passwords are hashed using bcrypt before storage
- JWT tokens are generated upon successful authentication
- Email addresses must be unique in the system
- Both firstname and lastname must be at least 3 characters long
- Password must be at least 6 characters long