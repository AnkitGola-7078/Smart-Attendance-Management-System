const express = require("express");

const router = express.Router();


// Authentication middleware
const authMiddleware = require("../middleware/authMiddleware");


const {
  addWorkingDays,
  getWorkingDays,
} = require("../controllers/workingDayController");


// ==========================================
// WORKING DAYS ROUTES
// ==========================================


// Add / Update working days
router.post(
  "/",
  authMiddleware,
  addWorkingDays
);


// Get current user's working days
router.get(
  "/",
  authMiddleware,
  getWorkingDays
);


module.exports = router;
