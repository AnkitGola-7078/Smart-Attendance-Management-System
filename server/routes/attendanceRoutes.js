const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  markAttendance,
  bulkMarkAttendance,
  markQRAttendance,
  markFaceAttendance,
  getAttendance,
  getStudentAttendance,
  getAttendanceHistory,
  getAttendanceByDate,
} = require("../controllers/attendanceController");

// ==========================================
// Protect all attendance routes
// ==========================================

router.use(authMiddleware);

// ==========================================
// Manual Attendance
// ==========================================

router.post(
  "/",
  markAttendance
);

// ==========================================
// Bulk Manual Attendance
// ==========================================

router.post(
  "/bulk",
  bulkMarkAttendance
);

// ==========================================
// QR Attendance
// ==========================================

router.post(
  "/qr",
  markQRAttendance
);

// ==========================================
// Face Recognition Attendance
// ==========================================

router.post(
  "/face",
  markFaceAttendance
);

// ==========================================
// All Attendance
// ==========================================

router.get(
  "/",
  getAttendance
);

// ==========================================
// Attendance History
// ==========================================

router.get(
  "/history",
  getAttendanceHistory
);

// ==========================================
// Attendance By Date
// ==========================================

router.get(
  "/history/:date",
  getAttendanceByDate
);

// ==========================================
// Student Report
// ==========================================

router.get(
  "/student/:rollNumber",
  getStudentAttendance
);

module.exports = router;
