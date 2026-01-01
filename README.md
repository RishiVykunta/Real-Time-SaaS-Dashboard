# Real-Time SaaS Admin Dashboard

A production-ready, real-time SaaS dashboard where admins and managers can monitor users, system activity, and analytics with live updates, secure role-based access, and professional UI.

## 🌐 Live Demo

- **Frontend:** [[https://e-commerce-seven-ashen-41.vercel.app](https://real-time-saa-s-dashboard.vercel.app)]()
- ⚠️ First request may take up to 30 seconds due to free-tier cold start.
 
## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with secure token storage
- Role-based access control (Admin, Manager, User)
- Protected routes on both frontend and backend
- Secure password hashing using bcrypt

### Real-Time Features (Socket.IO)
- Live user login/logout updates
- Real-time activity feed without page refresh
- Instant online users count updates
- New user registration notifications

### Admin Dashboard
- Total users count
- Active users (real-time)
- User growth charts with date range selection (7-365 days)
- Activity trends visualization
- Recent activity feed (live updates)
- User role distribution chart
- User management (activate/deactivate, search, export)
- System-wide activity logs with filtering
- CSV and PDF export functionality

### Manager Dashboard
- Analytics charts and reports
- Live activity notifications
- Read-only user data access
- User growth visualization

### User Profile
- View own profile information
- Account status and details
- Activity tracking

## 🛠️ Tech Stack

### Frontend
- React.js - UI library
- React Router - Client-side routing
- Context API - State management
- Chart.js / React-Chartjs-2 - Data visualization
- Socket.IO Client - Real-time communication
- Tailwind CSS - Styling
- Axios - HTTP client
- Vite - Build tool
- jsPDF - PDF export

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- PostgreSQL - Database
- Socket.IO - Real-time server
- JWT - Authentication
- bcryptjs - Password hashing

## 📁 Project Structure

```
SAAS/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── analyticsController.js
│   │   └── activityController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ActivityLog.js
│   │   └── Session.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── activityRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── utils/
│   │   └── jwt.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Toast.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── LoadingSkeleton.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── hooks/
    │   │   └── useSocket.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Unauthorized.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── Users.jsx
    │   │   │   └── Activities.jsx
    │   │   └── manager/
    │   │       └── ManagerDashboard.jsx
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── userService.js
    │   │   ├── analyticsService.js
    │   │   └── activityService.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   ├── dateFormatter.js
    │   │   ├── exportUtils.js
    │   │   └── avatarUtils.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (admin, manager, user)
- `status` - Account status (active, inactive)
- `created_at` - Registration timestamp

### Activity Logs Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `action` - Activity description
- `timestamp` - Activity timestamp

### Sessions Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `login_time` - Login timestamp
- `logout_time` - Logout timestamp (nullable)

## 👥 User Roles & Permissions

### Admin
- Full access to all users and analytics
- View system-wide statistics
- Manage users (activate/deactivate)
- View real-time system logs
- Export analytics data (CSV/PDF)
- Filter activities by user, date range, and action type

### Manager
- View analytics and reports
- View users (read-only)
- Receive live notifications
- Cannot manage users

### User
- Login & logout
- View own profile
- Trigger activity events














## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based route protection
- Token expiration handling
- CORS configuration
- SQL injection prevention (parameterized queries)

## 📊 Analytics Features

- **Line Chart:** User growth over time (7-365 days)
- **Bar Chart:** Activity trends
- **Doughnut Chart:** Role distribution
- **Real-time Stats:** Active users, total users, online users
- **Activity Feed:** Live activity stream
- **CSV Export:** Download analytics data
- **PDF Export:** Generate PDF reports

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_SOCKET_URL` - Your Socket.IO server URL

### Backend (Render)
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`
6. Add PostgreSQL database (Render PostgreSQL or Supabase)

### Database (Supabase)
1. Create a new PostgreSQL database
2. Update backend `.env` with connection string
3. Tables will be created automatically on first run

## 🧪 Testing the Application

1. **Login as Admin:**
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Create Test Users:**
   - Register new users via registration page
   - Assign different roles (admin, manager, user)

3. **Test Real-Time Features:**
   - Open multiple browser tabs
   - Login/Logout to see real-time updates
   - Create activities to see live feed





This is a demonstration project.
