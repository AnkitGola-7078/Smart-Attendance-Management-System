const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// Get Dashboard Data by Date
const getDashboardData = async (req, res) => {
  try {

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Please provide date"
      });
    }

    // Total students of logged-in teacher
    const totalStudents = await Student.countDocuments({
      createdBy: req.user.id
    });

    // Date range
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Attendance records for today
    const attendanceRecords = await Attendance.find({
      createdBy: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("student");

    // Remove duplicate attendance of same student
    const uniqueAttendance = [];
    const seenStudents = new Set();

    for (const record of attendanceRecords) {
      const id = record.student._id.toString();

      if (!seenStudents.has(id)) {
        seenStudents.add(id);
        uniqueAttendance.push(record);
      }
    }

    const present = uniqueAttendance.filter(
      item => item.status === "Present"
    ).length;

    const absent = totalStudents - present;

    const percentage =
      totalStudents > 0
        ? ((present / totalStudents) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        present,
        absent,
        percentage,
        records: uniqueAttendance
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  getDashboardData
};
