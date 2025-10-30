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

Example Validation Error Responses:
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
```json
{
  "errors": [
    {
      "msg": "password must be at least 6 characters long",
      "param": "password",
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

Example Validation Error Responses:
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
```json
{
  "errors": [
    {
      "msg": "password must be at least 6 characters long",
      "param": "password",
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

## Captain Endpoints

### 1. POST /captains/register

Register a new captain in the system.

#### Request

- Method: `POST`
- URL: `/captains/register`
- Content-Type: `application/json`

#### Request Body

```json
{
  "fullname": {
    "firstname": "string",    // minimum 3 characters
    "lastname": "string"
  },
  "email": "string",
  "password": "string",      // minimum 6 characters
  "phone": "string",         // minimum 10 characters
  "vehicle": {
    "color": "string",       // minimum 3 characters
    "plate": "string",       // minimum 4 characters, must be unique
    "capacity": number,      // minimum 1
    "vehicleType": "string"  // enum: "car", "motorcycle", "scooter", "auto-rickshaw"
  }
}
```

#### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| fullname.firstname | string | Captain's first name | Minimum 3 characters |
| fullname.lastname | string | Captain's last name | Required |
| email | string | Captain's email address | Must be unique, valid email format |
| password | string | Captain's password | Minimum 6 characters |
| phone | string | Captain's phone number | Minimum 10 characters, must be unique |
| vehicle.color | string | Vehicle color | Minimum 3 characters |
| vehicle.plate | string | Vehicle plate number | Minimum 4 characters, must be unique |
| vehicle.capacity | number | Vehicle passenger capacity | Minimum 1 |
| vehicle.vehicleType | string | Type of vehicle | Must be one of: "car", "motorcycle", "scooter", "auto-rickshaw" |

#### Responses

##### Success Response
- Status Code: `201 Created`
- Description: Captain successfully registered

Example Response:
```json
{
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.driver@example.com",
    "phone": "1234567890",
    "socketId": null,
    "status": "inactive",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "_id": "5f9d88b3b2b7c91234567890"
  }
}
```

##### Error Responses

###### Bad Request
- Status Code: `400 Bad Request`
- Description: Invalid input data or captain already exists

Example Validation Error Responses:
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
```json
{
  "errors": [
    {
      "msg": "password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "phone number must be at least 10 characters long",
      "param": "phone",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "color must be at least 3 characters long",
      "param": "vehicle.color",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "plate number must be at least 4 characters long",
      "param": "vehicle.plate",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "capacity must be at least 1 people",
      "param": "vehicle.capacity",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "Captain already exists",
    }
  ]
}
```

### 2. POST /captains/login

Authenticate an existing captain.

#### Request

- Method: `POST`
- URL: `/captains/login`
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
| email | string | Captain's email address | Must be valid email format |
| password | string | Captain's password | Minimum 6 characters |

#### Responses

##### Success Response
- Status Code: `200 OK`
- Description: Captain successfully logged in
- Sets HTTP-only cookie with JWT token

Example Response:
```json
{
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.driver@example.com",
    "phone": "1234567890",
    "status": "inactive",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "_id": "5f9d88b3b2b7c91234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Note: The token is both returned in the response and set as an HTTP-only cookie named 'token'

### 3. GET /captains/profile

Retrieve the authenticated captain's profile information.

#### Request

- Method: `GET`
- URL: `/captains/profile`
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
- Description: Captain profile retrieved successfully

Example Response:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.driver@example.com",
  "phone": "1234567890",
  "status": "inactive",
  "vehicle": {
    "color": "black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  },
  "location": {
    "latitude": null,
    "longitude": null
  },
  "_id": "5f9d88b3b2b7c91234567890"
}
```

##### Error Response
- Status Code: `401 Unauthorized`
- Description: Invalid or missing authentication token

Example Response:
```json
{
  "message": "Unauthorized"
}
```

### 4. GET /captains/logout

Log out the currently authenticated captain and invalidate their token.

#### Request

- Method: `GET`
- URL: `/captains/logout`
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
- Description: Captain successfully logged out

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
  "message": "Unauthorized"
}
```

## Error Response Reference

### User Endpoints Error Responses

#### /users/register
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
```json
{
  "errors": [
    {
      "msg": "password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### /users/login
```json
{
  "errors": [
    {
      "msg": "Invalid email or password"
    }
  ]
}
```
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
```json
{
  "errors": [
    {
      "msg": "password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### /users/profile and /users/logout
```json
{
  "message": "Unauthorized user"
}
```
```json
{
  "message": "Unauthorized user with this credentials"
}
```

### Captain Endpoints Error Responses

#### /captains/register
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
```json
{
  "errors": [
    {
      "msg": "password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "phone number must be at least 10 characters long",
      "param": "phone",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "color must be at least 3 characters long",
      "param": "vehicle.color",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "plate number must be at least 4 characters long",
      "param": "vehicle.plate",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "capacity must be at least 1 people",
      "param": "vehicle.capacity",
      "location": "body"
    }
  ]
}
```
```json
{
  "errors": [
    {
      "msg": "Captain already exists"
    }
  ]
}
```

#### /captains/login
```json
{
  "errors": [
    {
      "msg": "Invalid email or password"
    }
  ]
}
```
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
```json
{
  "errors": [
    {
      "msg": "password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### /captains/profile and /captains/logout
```json
{
  "message": "Unauthorized"
}
```
```json
{
  "message": "Unauthorized with this credentials"
}
```

## General Notes
- All passwords are hashed using bcrypt before storage
- JWT tokens are generated upon successful authentication and expire after 24 hours
- Email addresses must be unique across all users and captains
- Both firstname and lastname must be at least 3 characters long
- Password must be at least 6 characters long
- Phone numbers must be unique across all captains
- Vehicle plate numbers must be unique across all captains
- Captains have an initial status of "inactive"
- Tokens are blacklisted upon logout
- Authentication can be done via Authorization header (Bearer token) or cookies