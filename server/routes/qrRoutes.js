const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateQR,
  markQRAttendance
} = require("../controllers/qrController");

// Teacher/Admin generates QR
router.post("/generate", authMiddleware, generateQR);

// Student scans QR
router.post("/mark", markQRAttendance);

module.exports = router;
