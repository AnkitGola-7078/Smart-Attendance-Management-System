const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getDashboardData
} = require("../controllers/dashboardController");

// Protect dashboard route
router.get("/", authMiddleware, getDashboardData);

module.exports = router;
