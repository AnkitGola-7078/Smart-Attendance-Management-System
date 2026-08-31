const express = require("express");

const router = express.Router();


// Authentication middleware
const authMiddleware = require("../middleware/authMiddleware");


const {
  getStudentReport,
} = require("../controllers/reportController");


// ==========================================
// GET STUDENT REPORT
// ==========================================

router.get(
  "/:rollNumber",
  authMiddleware,
  getStudentReport
);


module.exports = router;
