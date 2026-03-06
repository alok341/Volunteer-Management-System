# Volunteer Management System

A full-stack application with JWT authentication, role-based access (Admin/Volunteer), and task management CRUD operations. Built as part of Backend Developer Intern assignment.

## 🚀 Live Demo
- **Backend API**: `http://localhost:8080`
- **Frontend App**: `http://localhost:3000`

## ✨ Features

### ✅ Authentication
- User registration with email verification
- Secure login with JWT tokens
- Password hashing using BCrypt
- Email verification flow (users must verify email before login)

### ✅ Role-Based Access Control
- **Admin**: Full access to manage users and view all tasks
- **Volunteer**: Can manage their own tasks only

### ✅ Task Management (CRUD)
- Create new tasks (title, description, status)
- View all tasks for logged-in user
- Update task details and status
- Delete tasks with confirmation
- Status tracking (PENDING, IN_PROGRESS, COMPLETED)

### ✅ Admin Panel
- View all registered users
- Delete users and their associated tasks
- View all tasks across the system

### ✅ Security Features
- JWT token-based authentication
- Password encryption
- Input validation
- Protected routes based on roles
- Email verification

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security** with JWT
- **MongoDB** for database
- **BCrypt** for password hashing
- **JavaMail** for email verification
- **Maven** for dependency management

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

## 📁 Project Structure
volunteer-management-system/
├── backend/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/example/
│ │ │ │ ├── config/ # Security & JWT config
│ │ │ │ ├── controller/ # REST controllers
│ │ │ │ ├── service/ # Business logic
│ │ │ │ ├── repository/ # Data access
│ │ │ │ ├── model/ # Entity classes
│ │ │ │ ├── dto/ # Data transfer objects
│ │ │ │ ├── security/ # JWT filters & utilities
│ │ │ │ └── VolunteerApplication.java
│ │ │ └── resources/
│ │ │ └── application.properties
│ │ └── test/
│ └── pom.xml
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Auth/ # Login & Register
│ │ │ ├── Dashboard/ # Task management
│ │ │ ├── Admin/ # Admin panel
│ │ │ └── Layout/ # Navbar, ProtectedRoute
│ │ ├── contexts/ # Auth context
│ │ ├── hooks/ # Custom hooks
│ │ ├── lib/ # Utilities
│ │ ├── pages/ # Page components
│ │ ├── services/ # API services
│ │ ├── types/ # TypeScript types
│ │ ├── App.tsx
│ │ └── main.tsx
│ ├── package.json
│ └── vite.config.ts
│
├── postman/
│ └── Volunteer-Management-API.postman_collection.json
│
├── application.log
├── README.md
└── .gitignore

text

## 🔧 Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/volunteer-management-system.git
   cd volunteer-management-system/backend
Configure MongoDB

Install MongoDB locally or use MongoDB Atlas

Update connection string in application.properties

Configure Email (Brevo/SendinBlue)

Create account at Brevo

Get SMTP credentials

Update in application.properties

Set environment variables

bash
# Copy example properties file
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit with your credentials
# - Add JWT secret
# - Add MongoDB URI
# - Add email credentials
Run the backend

bash
# Using Maven
./mvnw spring-boot:run

# Or using installed Maven
mvn spring-boot:run
Backend will start at http://localhost:8080

Frontend Setup
Navigate to frontend directory

bash
cd ../frontend
Install dependencies

bash
npm install
# or
yarn install
Set environment variables

bash
# Copy example env file
cp .env.example .env

# Update API URL if needed
VITE_API_URL=http://localhost:8080/api
Run the frontend

bash
npm run dev
# or
yarn dev
Frontend will start at http://localhost:5173

🔑 Environment Variables
Backend (.env or application.properties)
properties
# JWT Configuration
jwt.secret=your-256-bit-secret-key-for-jwt-token-generation
jwt.expiration=604800000

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/volunteerdb

# Email (Brevo)
spring.mail.host=smtp-relay.brevo.com
spring.mail.port=2525
spring.mail.username=your-email@example.com
spring.mail.password=your-smtp-password
app.mail.from=noreply@volunteerapp.com
app.mail.from-name=Volunteer Management System
Frontend (.env)
env
VITE_API_URL=http://localhost:8080/api
📮 API Documentation
Authentication Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login user	Public
GET	/api/auth/verify-email	Verify email with token	Public
POST	/api/auth/resend-verification	Resend verification email	Public
GET	/api/auth/profile	Get user profile	Authenticated
Task Endpoints
Method	Endpoint	Description	Access
GET	/api/tasks	Get all user tasks	Authenticated
GET	/api/tasks/{id}	Get task by ID	Authenticated
POST	/api/tasks	Create new task	Authenticated
PUT	/api/tasks/{id}	Update task	Authenticated
DELETE	/api/tasks/{id}	Delete task	Authenticated
Admin Endpoints
Method	Endpoint	Description	Access
GET	/api/admin/users	Get all users	Admin only
DELETE	/api/admin/users/{id}	Delete user	Admin only
GET	/api/admin/tasks/all	Get all tasks	Admin only
🧪 Testing the Application
Test Credentials
text
Admin User:
Email: admin@test.com
Password: password123

Volunteer User:
Email: volunteer@test.com
Password: password123
Test Flow
Register a new account (volunteer or admin)

Check email for verification link (check spam folder)

Verify email by clicking the link

Login with credentials

Create tasks from dashboard

Try admin features (if registered as admin)


🚀 Deployment
Backend Deployment (Render/Heroku)
Push code to GitHub

Connect to Render/Heroku

Add environment variables

Deploy

Frontend Deployment (Vercel/Netlify)
Push code to GitHub

Connect to Vercel/Netlify

Add environment variable VITE_API_URL

Deploy

📝 Assignment Requirements Met
✅ JWT Authentication with password hashing

✅ Role-based access (Admin vs Volunteer)

✅ CRUD APIs for Tasks

✅ Email verification flow

✅ Error handling & validation

✅ API documentation (Postman collection)

✅ MongoDB integration

✅ React frontend with TypeScript

✅ Responsive UI with shadcn/ui

✅ Admin panel for user management

✅ Log files included

✅ Scalable project structure

🤝 Contributing
This is an assignment project, but feedback is welcome!

📄 License
MIT License - feel free to use this project for learning purposes.

📧 Contact
dubeyalokkumar2005@gmail.com
Project Link:  https://github.com/alok341/Volunteer-Management-System.git

🙏 Acknowledgments
PrimeTrade.ai team for the assignment opportunity

Spring Boot documentation

React community

shadcn/ui components

⭐ Don't forget to star the repository if you found it helpful!
