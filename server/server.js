
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const workingDayRoutes = require("./routes/workingDayRoutes");
const reportRoutes = require("./routes/reportRoutes");
const qrRoutes = require("./routes/qrRoutes");
const faceRoutes = require("./routes/faceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/working-days", workingDayRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/face", faceRoutes);

app.get("/", (req, res) => {
    res.send("Smart Attendance Backend is Running...");
});

if (require.main === module) {
    connectDB()
        .then(() => {
            const PORT = process.env.PORT || 5000;

            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Database startup failed:", error);
            process.exit(1);
        });
}

module.exports = app;
