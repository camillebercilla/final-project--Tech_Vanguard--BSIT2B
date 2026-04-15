🚌 Bus Booking System Backend

This is the backend for a Bus Booking System built using Node.js, Express, and MongoDB. It follows a structured MVC architecture with authentication and role-based access (Admin & User).

🚀 Features
👤 User Features
Register and login
View trips
Book tickets
View personal bookings
🔐 Admin Features
Manage buses
Create and manage trips
View all bookings
Manage users
🏗️ Project Structure
backend/
│
├── config/
│   └── db.js                # Database connection
│
├── controllers/            # Business logic
│   ├── adminController.js
│   ├── bookingController.js
│   ├── tripController.js
│   └── userController.js
│
├── middleware/
│   └── authMiddleware.js   # Authentication & authorization
│
├── models/                 # Mongoose schemas
│   ├── Booking.js
│   ├── Bus.js
│   ├── Trip.js
│   └── User.js
│
├── routes/                 # API routes
│   ├── adminRoutes.js
│   ├── bookingRoutes.js
│   ├── busRoutes.js
│   ├── tripRoutes.js
│   └── userRoutes.js
│
├── .env                    # Environment variables
├── server.js               # Entry point
├── package.json
└── README.md
⚙️ Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JSON Web Token (JWT)
dotenv
🔑 Environment Variables

Create a .env file in the root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
📦 Installation
# Clone the repository
git clone https://github.com/your-username/bus-booking-backend.git

# Navigate to project folder
cd backend

# Install dependencies
npm install
▶️ Running the Server
npm run dev

or

npm start

Server will run on:

http://localhost:5000
🔐 Authentication
Uses JWT (JSON Web Tokens)
Token must be included in headers:
Authorization: Bearer <token>
📡 API Endpoints
👤 User Routes
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile
🚌 Bus Routes
GET    /api/buses
POST   /api/buses        (Admin only)
🧭 Trip Routes
GET    /api/trips
POST   /api/trips        (Admin only)
🎟️ Booking Routes
POST   /api/bookings
GET    /api/bookings
🔐 Admin Routes
GET    /api/admin/users
GET    /api/admin/bookings
POST   /api/admin/bus
POST   /api/admin/trip
🔒 Middleware
authMiddleware.js
Verifies JWT token
Protects routes
Handles role-based access (Admin/User)
🔄 Request Flow
Client → Route → Controller → Model → Database → Response
📌 Notes
Admin routes are protected and require admin role
Passwords should be hashed before saving
Always validate input data

