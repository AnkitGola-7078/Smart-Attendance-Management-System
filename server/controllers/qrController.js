const QRSession = require("../models/QRSession");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const { v4: uuidv4 } = require("uuid");

// =========================
// Generate QR
// =========================
const generateQR = async (req, res) => {
  try {
    const token = uuidv4();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const session = new QRSession({
      token,
      createdBy: req.user.id,
      expiresAt,
      active: true
    });

    await session.save();

    res.status(200).json({
      success: true,
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// Mark Attendance
// =========================
const markQRAttendance = async (req, res) => {
  try {
    const { token, rollNumber } = req.body;

    // Find QR Session
    const session = await QRSession.findOne({
      token,
      active: true
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR Code"
      });
    }

    // Check expiry
    if (new Date() > session.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "QR Code Expired"
      });
    }

    // Find student belonging to the same teacher
    const student = await Student.findOne({
      rollNumber,
      createdBy: session.createdBy
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Today's start and end time
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Prevent duplicate attendance
    const alreadyMarked = await Attendance.findOne({
      student: student._id,
      createdBy: session.createdBy,
      date: {
        $gte: start,
        $lte: end
      }
    });

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked today"
      });
    }

    // Save attendance
    const attendance = new Attendance({
      student: student._id,
      status: "Present",
      method: "QR Code",
      createdBy: session.createdBy
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance Marked Successfully",
      student
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateQR,
  markQRAttendance
};
