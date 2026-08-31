const WorkingDay = require("../models/WorkingDay");


// ==========================================
// Add / Update Working Days
// ==========================================

const addWorkingDays = async (req, res) => {

  try {

    const {
      academicYear,
      totalDays
    } = req.body;


    // Check authentication
    if (!req.user || !req.user.id) {

      return res.status(401).json({

        success: false,

        message: "User authentication required"

      });

    }


    // Validate data
    if (!academicYear || totalDays === undefined) {

      return res.status(400).json({

        success: false,

        message: "Academic year and total working days are required"

      });

    }


    // Find existing working days for this user
    const existingWorkingDay =
      await WorkingDay.findOne({

        createdBy: req.user.id,

        academicYear

      });


    let workingDay;


    // If already exists → update
    if (existingWorkingDay) {

      existingWorkingDay.totalDays =
        Number(totalDays);

      workingDay =
        await existingWorkingDay.save();

    }

    // Otherwise → create
    else {

      workingDay =
        await WorkingDay.create({

          createdBy: req.user.id,

          academicYear,

          totalDays: Number(totalDays)

        });

    }


    res.status(200).json({

      success: true,

      message: "Working days saved successfully",

      data: workingDay

    });


  }
  catch (error) {

    console.error(
      "ADD WORKING DAYS ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



// ==========================================
// Get Working Days
// ==========================================

const getWorkingDays = async (req, res) => {

  try {

    // Check authentication
    if (!req.user || !req.user.id) {

      return res.status(401).json({

        success: false,

        message: "User authentication required"

      });

    }


    // Get latest working days
    // belonging ONLY to logged-in user

    const workingDays =
      await WorkingDay.findOne({

        createdBy: req.user.id

      })
      .sort({
        createdAt: -1
      });


    res.status(200).json({

      success: true,

      data: workingDays

    });


  }
  catch (error) {

    console.error(
      "GET WORKING DAYS ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


module.exports = {

  addWorkingDays,

  getWorkingDays

};
