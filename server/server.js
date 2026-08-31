const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");


// Routes
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const workingDayRoutes = require("./routes/workingDayRoutes");
const reportRoutes = require("./routes/reportRoutes");
const qrRoutes = require("./routes/qrRoutes");
const faceRoutes = require("./routes/faceRoutes");



const app = express();



// Connect MongoDB

connectDB();



// Middleware

app.use(cors());

app.use(express.json());



// Static uploads folder

app.use(
    "/uploads",
    express.static("uploads")
);




// ================= API ROUTES =================


// Student Management

app.use(
    "/api/students",
    studentRoutes
);


// Attendance

app.use(
    "/api/attendance",
    attendanceRoutes
);


// Login/Register

app.use(
    "/api/auth",
    authRoutes
);


// Dashboard

app.use(
    "/api/dashboard",
    dashboardRoutes
);


// Working Days

app.use(
    "/api/working-days",
    workingDayRoutes
);


// Reports

app.use(
    "/api/report",
    reportRoutes
);


// QR Attendance

app.use(
    "/api/qr",
    qrRoutes
);


// Face Recognition Attendance

app.use(
    "/api/face",
    faceRoutes
);





// Test Route

app.get("/", (req,res)=>{

    res.send(
        "Smart Attendance Backend is Running..."
    );

});





// Server Start

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});