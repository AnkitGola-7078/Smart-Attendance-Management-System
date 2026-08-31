# 🎓 Smart Attendance Management System

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styled-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-blue)

A modern **full-stack Smart Attendance Management System** built using the **MERN Stack**. The application enables teachers and administrators to efficiently manage students, record attendance using multiple methods, generate attendance reports, manage account-specific working days, and visualize attendance analytics through an intuitive dashboard.

---

## 🌐 Live Demo

**Frontend:** https://client-tau-dun.vercel.app/

**Backend API:** https://smart-attendance-system-ydti.onrender.com

---

## ✨ Features

### 🔐 Authentication

- Teacher/Admin Registration
- Secure Login using JWT Authentication
- Protected Routes
- User-specific student management
- User-specific data isolation

### 👨‍🎓 Student Management

- Add Students
- Delete Students
- Upload Student Face Images
- Store Student Face Embeddings
- View Student List
- Search Students
- User-specific student management
- Roll number uniqueness within each teacher/admin account

### ✅ Attendance Management

- Manual Attendance
- QR Code Attendance
- Face Recognition Attendance
- Bulk Attendance
- Attendance Statistics
- Present/Absent Status Management
- Student-specific Attendance Records

### 📊 Dashboard

- Total Students
- Present Students
- Absent Students
- Attendance Percentage
- Interactive Attendance Graph
- Daily Attendance Details
- Account-specific attendance analytics

### 📅 Attendance History

- Date-wise Attendance Records
- Attendance Details Modal
- Attendance Percentage Calculation
- Search by Date
- Student-specific Attendance History
- Attendance Method Tracking

### 📄 Student Reports

- Student Profile
- Student Face Image
- Attendance Summary
- Total Working Days
- Present Days
- Absent Days
- Attendance Percentage
- Complete Attendance History
- Attendance Method
- Share Attendance Report
- Account-specific Student Reports

### 📚 Working Days Management

- Set Academic Year
- Manage Total Working Days
- View Current Working Days
- Account-specific Working Days
- Different teachers/admins can have different working-day values
- Working days are shared among all students belonging to the same teacher/admin account
- Working days do not affect students belonging to other accounts

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- QRCode React

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- bcrypt
- 
## Cloud Services

- Cloudinary – Cloud Image Storage & CDN
---

# 📂 Project Structure

```
smart-attendance-system/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/smart-attendance-system.git

cd smart-attendance-system
```

---

## Backend Setup

```bash
cd server

npm install

npm start
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# ⚙️ Environment Variables

## Backend (.env)

```env
PORT=5000

MONGODB_URI=mongodb_connection_string

JWT_SECRET=secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

# 📸 Screenshots


---

# 🔒 Authentication

- JWT Based Authentication
- Password Hashing using bcrypt
- Protected APIs
- User-specific Data Isolation

---

# 📈 Future Enhancements

- Email Notifications
- Attendance Export to PDF
- Attendance Export to Excel
- Student Portal
- Parent Portal
- Mobile Application
- Real-time Notifications
- AI Face Recognition Improvements
- Dark/Light Theme Toggle

---

# 💡 Learning Outcomes

This project demonstrates practical implementation of:

1. MERN Stack Development
2. REST API Design
3. JWT Authentication
4. Protected API Routes
5. MongoDB Relationships
6. Mongoose Schema Design
7. User-specific Data Isolation
8. Account-based Data Management
9. File Uploads
10. Cloud Image Storage
11. Dashboard Analytics
12. QR Code Integration
13. Face Recognition
14. Face Embeddings
15. Attendance Percentage Calculation
16. Account-specific Working Days Management
17. Student Ownership
18. Compound Database Indexing
19. Responsive UI Design

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Ramesh Netheti**

B.Tech Computer Science & Engineering

📧 Email: ankitprajapati3785@gmail.com

🔗 LinkedIn: https://www.linkedin.com/in/ankitgola1304

💻 GitHub: https://github.com/AnkitGola-7078/

---

## ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub. It helps others discover the project and supports future development.
