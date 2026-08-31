const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const WorkingDay = require("../models/WorkingDay");


// ==========================================
// GET STUDENT ATTENDANCE REPORT
// ==========================================

const getStudentReport = async (req, res) => {

  try {

    const { rollNumber } = req.params;


    // ========================================
    // Check logged-in user
    // ========================================

    if (!req.user || !req.user.id) {

      return res.status(401).json({

        success: false,

        message: "User authentication required",

      });

    }


    // ========================================
    // FIND STUDENT
    // ========================================
    // Student must belong to the logged-in user

    const student = await Student.findOne({

      rollNumber: rollNumber,

      createdBy: req.user.id,

    });


    if (!student) {

      return res.status(404).json({

        success: false,

        message: "Student not found",

      });

    }


    // ========================================
    // GET ATTENDANCE HISTORY
    // ========================================

    const attendance = await Attendance.find({

      student: student._id,

    })
    .sort({

      date: -1,

    });


    // ========================================
    // GET WORKING DAYS
    // ========================================
    // IMPORTANT:
    // Only get working days belonging
    // to the logged-in user

    const workingDays =
      await WorkingDay.findOne({

        createdBy: req.user.id,

      })
      .sort({

        createdAt: -1,

      });


    // If the user has not set working days
    // then use 0

    const totalWorkingDays =
      workingDays
        ? workingDays.totalDays
        : 0;


    // ========================================
    // CALCULATE PRESENT DAYS
    // ========================================

    const presentDays =
      attendance.filter(

        (record) =>
          record.status === "Present"

      ).length;


    // ========================================
    // CALCULATE ABSENT DAYS
    // ========================================

    const absentDays =
      attendance.filter(

        (record) =>
          record.status === "Absent"

      ).length;


    // ========================================
    // CALCULATE ATTENDANCE PERCENTAGE
    // ========================================

    let percentage = 0;


    if (totalWorkingDays > 0) {

      percentage = (

        (presentDays / totalWorkingDays) *
        100

      ).toFixed(2);

    }


    // ========================================
    // SEND RESPONSE
    // ========================================

    res.status(200).json({

      success: true,

      data: {

        student: student,

        attendance: {

          totalWorkingDays: totalWorkingDays,

          presentDays: presentDays,

          absentDays: absentDays,

          percentage: percentage,

        },

        attendanceHistory: attendance,

      },

    });

  }

  catch (error) {

    console.error(
      "GET STUDENT REPORT ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


module.exports = {

  getStudentReport,

};
