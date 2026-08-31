const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const QRSession = require("../models/QRSession");

// ==================================================
// Manual Attendance
// ==================================================

const markAttendance = async (req, res) => {
  try {

    const {
      student,
      status,
      method,
    } = req.body;

    const start = new Date();

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end = new Date();

    end.setHours(
      23,
      59,
      59,
      999
    );

    const existingAttendance =
      await Attendance.findOne({
        student: student,
        createdBy: req.user.id,
        date: {
          $gte: start,
          $lte: end,
        },
      });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance already marked today",
      });
    }

    const attendance =
      new Attendance({
        student,
        status,
        method:
          method || "Manual",
        createdBy: req.user.id,
      });

    await attendance.save();

    res.status(201).json({
      success: true,
      message:
        "Attendance marked successfully",
      data: attendance,
    });

  } catch (error) {

    console.error(
      "MANUAL ATTENDANCE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Bulk Attendance
// ==================================================

const bulkMarkAttendance = async (
  req,
  res
) => {
  try {

    const {
      attendanceList,
    } = req.body;

    for (
      const item of attendanceList
    ) {

      const attendance =
        new Attendance({
          student: item.student,
          status: item.status,
          method: "Manual",
          createdBy: req.user.id,
        });

      await attendance.save();
    }

    res.status(200).json({
      success: true,
      message:
        "Attendance saved successfully",
    });

  } catch (error) {

    console.error(
      "BULK ATTENDANCE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// QR Attendance
// ==================================================

const markQRAttendance = async (
  req,
  res
) => {
  try {

    const {
      token,
      rollNumber,
    } = req.body;

    const qrSession =
      await QRSession.findOne({
        token,
        active: true,
      });

    if (!qrSession) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR",
      });
    }

    const student =
      await Student.findOne({
        rollNumber,
        createdBy: req.user.id,
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    const attendance =
      new Attendance({
        student: student._id,
        status: "Present",
        method: "QR Code",
        createdBy: req.user.id,
      });

    await attendance.save();

    res.status(201).json({
      success: true,
      message:
        "Attendance marked",
    });

  } catch (error) {

    console.error(
      "QR ATTENDANCE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Face Recognition Attendance
// ==================================================

const markFaceAttendance = async (
  req,
  res
) => {
  try {

    const {
      student,
    } = req.body;

    // ------------------------------------------
    // Check student ID
    // ------------------------------------------

    if (!student) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID is required",
      });
    }

    // ------------------------------------------
    // Verify student belongs to teacher
    // ------------------------------------------

    const studentData =
      await Student.findOne({
        _id: student,
        createdBy: req.user.id,
      });

    if (!studentData) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    // ------------------------------------------
    // Check face registration
    // ------------------------------------------

    if (
      !Array.isArray(
        studentData.faceEmbedding
      ) ||
      studentData.faceEmbedding.length !== 128
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This student does not have a registered face",
      });
    }

    // ------------------------------------------
    // Today's range
    // ------------------------------------------

    const start = new Date();

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end = new Date();

    end.setHours(
      23,
      59,
      59,
      999
    );

    // ------------------------------------------
    // Prevent duplicate attendance
    // ------------------------------------------

    const existingAttendance =
      await Attendance.findOne({
        student: studentData._id,
        createdBy: req.user.id,
        date: {
          $gte: start,
          $lte: end,
        },
      });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message:
          `${studentData.name} attendance is already marked today`,
      });
    }

    // ------------------------------------------
    // Save attendance
    // ------------------------------------------

    const attendance =
      new Attendance({
        student:
          studentData._id,

        status:
          "Present",

        method:
          "Face Recognition",

        createdBy:
          req.user.id,
      });

    await attendance.save();

    res.status(201).json({
      success: true,
      message:
        "Face attendance marked successfully",
      data: attendance,
    });

  } catch (error) {

    console.error(
      "FACE ATTENDANCE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// All Attendance
// ==================================================

const getAttendance = async (
  req,
  res
) => {
  try {

    const attendance =
      await Attendance.find({
        createdBy: req.user.id,
      })
        .populate("student")
        .sort({
          date: -1,
        });

    res.json({
      success: true,
      data: attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// History
// ==================================================

const getAttendanceHistory = async (
  req,
  res
) => {
  try {

    const attendance =
      await Attendance.find({
        createdBy: req.user.id,
      })
        .populate("student");

    const history = {};

    attendance.forEach(
      (record) => {

        const date =
          new Date(record.date)
            .toISOString()
            .split("T")[0];

        if (!history[date]) {

          history[date] = {
            date,
            present: 0,
            absent: 0,
            total: 0,
          };
        }

        history[date].total++;

        if (
          record.status ===
          "Present"
        ) {
          history[date].present++;
        } else {
          history[date].absent++;
        }
      }
    );

    res.json({
      success: true,
      data:
        Object.values(history),
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Attendance By Date
// ==================================================

const getAttendanceByDate = async (
  req,
  res
) => {
  try {

    const date =
      req.params.date;

    const start =
      new Date(date);

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end =
      new Date(date);

    end.setHours(
      23,
      59,
      59,
      999
    );

    const attendance =
      await Attendance.find({
        createdBy: req.user.id,
        date: {
          $gte: start,
          $lte: end,
        },
      })
        .populate("student");

    res.json({
      success: true,
      data: attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Student Report
// ==================================================

const getStudentAttendance = async (
  req,
  res
) => {
  try {

    const student =
      await Student.findOne({
        rollNumber:
          req.params.rollNumber,

        createdBy:
          req.user.id,
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    const attendance =
      await Attendance.find({
        student: student._id,
        createdBy: req.user.id,
      });

    res.json({
      success: true,
      student,
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Export
// ==================================================

module.exports = {

  markAttendance,

  bulkMarkAttendance,

  markQRAttendance,

  markFaceAttendance,

  getAttendance,

  getAttendanceHistory,

  getAttendanceByDate,

  getStudentAttendance,

};
