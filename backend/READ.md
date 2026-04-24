# 🚌 Bus Booking System Backend

A RESTful backend API for a **Bus Booking System**, built with **Node.js**, **Express**, and **MongoDB**.
This project follows the **MVC (Model–View–Controller)** architecture and implements **JWT-based authentication** with **role-based access control (Admin & User)**.

---

## 👨‍💻 Developers 

- Nathaniel O. Raynada
- Anna Mae Broma
- Camille Bercilla
- Mariel Odoño
- John Edmar Bongcodin
- Justine James Dasallas
---
## 📌 Project Info
Details	Description
- 📚 Course	IT 112 – Web Systems and Technologies
- 👨‍🏫 Instructor	Guillermo V. Red, Jr.
- 📅 Date	March 28, 2026

---
## 🚀 Features

### 👤 User Capabilities

* Register a new account
* Login with authentication
* Browse available trips
* Book bus tickets
* View personal booking history

### 🔐 Admin Capabilities

* Add and manage buses
* Create and manage trips
* View all bookings in the system
* Manage registered users

---

## 🏗️ Project Structure

```
backend/
│
├── config/
│   └── db.js                # MongoDB connection setup
│
├── controllers/            # Business logic layer
│   ├── adminController.js
│   ├── bookingController.js
│   ├── tripController.js
│   └── userController.js
│
├── middleware/
│   └── authMiddleware.js   # JWT auth & role protection
│
├── models/                 # Mongoose data schemas
│   ├── Booking.js
│   ├── Bus.js
│   ├── Trip.js
│   └── User.js
│
├── routes/                 # API endpoints
│   ├── adminRoutes.js
│   ├── bookingRoutes.js
│   ├── busRoutes.js
│   ├── tripRoutes.js
│   └── userRoutes.js
│
├── .env                    # Environment configuration
├── server.js               # Application entry point
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

* **Node.js** – Runtime environment
* **Express.js** – Web framework
* **MongoDB** – NoSQL database
* **Mongoose** – ODM for MongoDB
* **JWT (JSON Web Token)** – Authentication
* **dotenv** – Environment variable management

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/camillebercilla/final-project--Tech_Vanguard--BSIT2B.git

# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

---

## ▶️ Running the Server

```bash
# Development mode (if using nodemon)
npm run dev
```

```bash
# Production mode
npm start
```

📍 Server will run at:

```
http://localhost:5000
```

---

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)**.

Include the token in request headers:

```
Authorization: Bearer <your_token_here>
```

---

## 📡 API Endpoints

### 👤 User Routes

```
POST   /api/users/register      # Register new user
POST   /api/users/login         # Login user
GET    /api/users/profile       # Get user profile
```

---

### 🚌 Bus Routes

```
GET    /api/buses               # Get all buses
POST   /api/buses               # Create bus (Admin only)
```

---

### 🧭 Trip Routes

```
GET    /api/trips               # Get all trips
POST   /api/trips               # Create trip (Admin only)
```

---

### 🎟️ Booking Routes

```
POST   /api/bookings            # Create booking
GET    /api/bookings            # Get user bookings
```

---

### 🔐 Admin Routes

```
GET    /api/admin/users         # Get all users
GET    /api/admin/bookings      # Get all bookings
POST   /api/admin/bus           # Add new bus
POST   /api/admin/trip          # Create trip
```

---

## 🔒 Middleware

### `authMiddleware.js`

Handles:

* JWT token verification
* Route protection
* Role-based authorization (Admin/User)

---

## 🔄 Request Flow

```
Client → Route → Controller → Model → Database → Response
```

---

## 📌 Best Practices Implemented

* 🔐 JWT-based authentication
* 🧱 MVC architecture
* 🔄 Separation of concerns
* 🔍 Basic input validation
* 🔑 Role-based access control (Admin & User)

---

## ⚠️ Notes

* Admin routes are protected and require an **admin role**
* Ensure passwords are **hashed** before storing
* Always validate incoming data to prevent errors or attacks

---


