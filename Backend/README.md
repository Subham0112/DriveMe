# DriveMe API Documentation

## User Registration Endpoint

### POST /users/register

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

#### Notes
- The password is automatically hashed using bcrypt before storage
- A JWT token is generated and returned upon successful registration
- The email must be unique in the system
- Both firstname and lastname must be at least 3 characters long