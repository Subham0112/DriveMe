#  DriveMe - Ride Booking Application

A modern, full-stack ride-booking application built with cutting-edge technologies. DriveMe connects riders and captains (drivers) for seamless ride sharing with real-time location tracking and payment integration.

![DriveMe Logo](frontend/public/driveme-logo.png)

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Project Architecture](#project-architecture)
- [Contributing](#contributing)
- [License](#license)

---

##  Overview

DriveMe is a comprehensive ride-sharing platform that enables users to book rides and captains to accept and complete rides. The application features real-time location tracking, interactive maps, payment processing, and ride history management. Both users and captains have dedicated interfaces with authentication and role-based access control.

---

## ✨ Features

### User Features
-  **User Authentication** - Secure signup and login
-  **Ride Booking** - Search and book rides with location-based matching
-  **Real-time Tracking** - Live location tracking during rides
-  **Interactive Maps** - View pickup and drop locations on interactive maps
-  **Ride History** - Complete history of all completed rides
-  **Payment Integration** - Multiple payment options with success/failure handling
-  **User Profile** - Manage personal information and preferences
-  **Notifications** - Real-time alerts and ride updates

### Captain (Driver) Features
-  **Captain Registration** - Easy onboarding for drivers
-  **Ride Requests** - Real-time notifications for new ride requests
-  **Accept/Decline Rides** - Choose which rides to accept
-  **Active Ride Management** - Track current rides in real-time
-  **Ride History** - View all completed rides with details
-  **Captain Profile** - Update vehicle and personal information
-  **Location Updates** - Broadcast location to available riders

### General Features
-  **JWT Authentication** - Secure token-based authentication
-  **Real-time Communication** - Socket.io for instant updates
-  **Geolocation Services** - Geocoding and location-based services
-  **Responsive Design** - Mobile-friendly UI with Tailwind CSS
-  **Modern UI** - Sleek interface with animations (GSAP)
-  **Performance Optimized** - Fast load times and smooth interactions

---

##  Tech Stack

### Frontend
- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **Routing:** React Router DOM 7.9.4
- **Styling:** Tailwind CSS 3.4.18
- **HTTP Client:** Axios 1.13.2
- **Real-time:** Socket.io Client 4.8.3
- **Maps:** Leaflet 1.9.4 & React-Leaflet 5.0.0
- **Animation:** GSAP 3.14.2
- **Icons:** Lucide React & React Icons
- **Linting:** ESLint

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB 8.19.2 (Mongoose ODM)
- **Real-time:** Socket.io 4.8.3
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Security:** Bcrypt 6.0.0
- **Validation:** Express Validator 7.3.0
- **CORS:** Enabled for cross-origin requests
- **Cookie Parser:** For session management

---

##  Project Structure

```
DriveMe/
├── Backend/                    # Node.js & Express server
│   ├── controllers/            # Request handlers
│   │   ├── user.controller.js
│   │   ├── captain.controller.js
│   │   └── ride.controller.js
│   ├── models/                 # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── tokenBacklist.model.js
│   ├── routes/                 # API routes
│   │   ├── user.routes.js
│   │   ├── captain.route.js
│   │   └── ride.route.js
│   ├── services/               # Business logic
│   │   ├── user.service.js
│   │   └── captain.service.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.middleware.js
│   ├── socket/                 # Real-time communication
│   │   └── socket.js
│   ├── db/                     # Database connection
│   │   └── db.js
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── README.md
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── home.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── UserSignup.jsx
│   │   │   ├── UserMainPage.jsx
│   │   │   ├── UserLogout.jsx
│   │   │   ├── CaptainLogin.jsx
│   │   │   ├── CaptainSignup.jsx
│   │   │   ├── CaptainMainPage.jsx
│   │   │   ├── CaptainLogout.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentFailure.jsx
│   │   │   └── infoPage.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── captainComponents/
│   │   │   │   ├── ActiveRide.jsx
│   │   │   │   ├── CaptainMap.jsx
│   │   │   │   └── RideRequest.jsx
│   │   │   └── userComponents/
│   │   │       ├── LocationSearchPanel.jsx
│   │   │       ├── UserActiveRide.jsx
│   │   │       ├── UserMaps.jsx
│   │   │       ├── RiderDetails.jsx
│   │   │       ├── ShowRaiders.jsx
│   │   │       └── PaymentModal.jsx
│   │   ├── context/            # React Context
│   │   │   ├── UserContext.jsx
│   │   │   └── CaptainContext.jsx
│   │   ├── UserAuth/           # Auth protection
│   │   │   ├── UserProtectAuth.jsx
│   │   │   └── CaptainProtectAuth.jsx
│   │   ├── CaptainPages/       # Captain-specific pages
│   │   │   ├── CaptainProfile.jsx
│   │   │   └── CaptainRideHistory.jsx
│   │   ├── UserPages/          # User-specific pages
│   │   │   ├── UserProfile.jsx
│   │   │   └── UserRideHistory.jsx
│   │   ├── services/           # API services
│   │   │   └── rideService.js
│   │   ├── socket/             # Socket configuration
│   │   │   └── socket.js
│   │   ├── utils/              # Utility functions
│   │   │   └── geocode.js
│   │   ├── assets/             # Images & media
│   │   ├── App.jsx             # Main App component
│   │   ├── main.jsx            # React entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── public/                 # Static files
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── postcss.config.js       # PostCSS config
│   ├── eslint.config.js        # ESLint config
│   ├── package.json
│   ├── index.html
│   ├── .env                    # Environment variables
│   └── README.md
│
└── captain.txt                 # Project notes
```

---

##  Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (Local or Atlas URI)

### Clone the Repository
```bash
git clone https://github.com/yourusername/DriveMe.git
cd DriveMe
```

### Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # if available, or create manually

# Configure .env with:
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other required environment variables
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # if available, or create manually

# Configure .env with:
VITE_API_URL=http://localhost:3000
# Add other required environment variables
```

---

##  Configuration.



##  Running the Project

### Development Mode

#### Terminal 1 - Start Backend Server
```bash
cd Backend
npm start
# or use nodemon for auto-reload:
# npm install -g nodemon
# nodemon server.js
```

The backend will run on `http://localhost:3000`

#### Terminal 2 - Start Frontend Development Server
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend with Build
```bash
cd Backend
npm start
```

#### User Signup
```
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### User Login
```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Captain Signup
```
POST /captains/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "captainpass123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Ride Endpoints

#### Create Ride Request
```
POST /rides/create
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "pickup": "123 Main St",
  "drop": "456 Oak Ave",
  "pickupLatitude": 40.7128,
  "pickupLongitude": -74.0060,
  "dropLatitude": 40.7580,
  "dropLongitude": -73.9855
}
```

#### Accept Ride (Captain)
```
POST /rides/:rideId/accept
Authorization: Bearer <captain_token>
```

#### Get Ride History
```
GET /users/rides-history
Authorization: Bearer <token>
```

---

## 🏗️ Project Architecture

### Frontend Architecture
- **Component-Based:** Reusable React components for UI
- **Context API:** State management for user and captain data
- **Socket.io Integration:** Real-time ride updates and notifications
- **Protected Routes:** Authentication guards for user/captain pages
- **Responsive Design:** Mobile-first approach with Tailwind CSS

### Backend Architecture
- **MVC Pattern:** Models, Views (API responses), Controllers
- **RESTful APIs:** Standard HTTP methods for CRUD operations
- **Real-time Socket.io:** Bi-directional communication for live updates
- **JWT Authentication:** Secure token-based user authentication
- **Database:** MongoDB with Mongoose ODM for data persistence
- **Middleware:** Authentication, validation, error handling

### Data Flow
```
User Action → Frontend Component → Socket.io/Axios → Backend API
→ Database (MongoDB) → Socket.io Event → Update Frontend State
→ Component Re-render → User Sees Update
```

---

## 🔐 Security Features

- 🔐 **JWT Authentication** - Secure login tokens
- 🔒 **Password Hashing** - Bcrypt for secure password storage
- 🛡️ **CORS Enabled** - Cross-origin requests properly configured
- ✅ **Input Validation** - Express Validator for data validation
- 🔄 **Token Blacklist** - Logout functionality with token invalidation
- 👤 **Role-based Access** - Different routes for users and captains

---

## 🧪 Testing

```bash
# Frontend linting
cd frontend
npm run lint

# Backend testing (if configured)
cd Backend
npm test
```

---

## 📱 Key Pages

### User Pages
- **Home** - Landing page with app info
- **Sign Up** - User registration
- **Login** - User authentication
- **Main Page** - Book rides, view available captains
- **Profile** - User profile management
- **Ride History** - Past rides and reviews
- **Payment** - Payment success/ failure page

### Captain Pages
- **Sign Up** - Captain registration with vehicle details
- **Login** - Captain authentication
- **Main Page** - View ride requests
- **Profile** - Update captain info and vehicle details
- **Ride History** - View completed rides and earnings

---

## 🚨 Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify `MONGODB_URI` in `.env` file

### Socket.io Connection Issues
- Check CORS settings in backend `server.js`
- Ensure frontend and backend are on correct URLs/ports
- Check browser console for connection errors



