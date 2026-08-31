const Student = require("../models/Student");

const cloudinary =
  require("../config/cloudinary");

const streamifier =
  require("streamifier");


// ==================================================
// Create Student
// ==================================================

const createStudent = async (req, res) => {
  try {

    const student = new Student({

      ...req.body,

      createdBy: req.user.id,

    });

    await student.save();

    res.status(201).json({

      success: true,

      message:
        "Student created successfully",

      data: student,

    });

  } catch (error) {

    console.error(
      "CREATE STUDENT ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};


// ==================================================
// Get Logged-in User Students
// ==================================================

const getAllStudents = async (req, res) => {
  try {

    const students =
      await Student.find({

        createdBy:
          req.user.id,

      });

    res.status(200).json({

      success: true,

      count:
        students.length,

      data:
        students,

    });

  } catch (error) {

    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};


// ==================================================
// Delete Student
// ==================================================

const deleteStudent = async (req, res) => {
  try {

    const student =
      await Student.findOneAndDelete({

        _id:
          req.params.id,

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

    res.status(200).json({

      success: true,

      message:
        "Student deleted successfully",

    });

  } catch (error) {

    console.error(
      "DELETE STUDENT ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};


// ==================================================
// Upload Image to Cloudinary
// ==================================================

const uploadToCloudinary = (buffer) => {

  return new Promise(
    (resolve, reject) => {

      const stream =
        cloudinary.uploader.upload_stream(

          {
            folder:
              "smart_attendance/faces",

            resource_type:
              "image",
          },

          (error, result) => {

            if (error) {

              reject(error);

            } else {

              resolve(result);

            }

          }

        );


      streamifier
        .createReadStream(buffer)
        .pipe(stream);

    }
  );

};


// ==================================================
// Upload / Register Face
// ==================================================

const uploadFaceImage = async (
  req,
  res
) => {

  try {

    console.log(
      "======================================"
    );

    console.log(
      "FACE REGISTRATION STARTED"
    );

    console.log(
      "Student ID:",
      req.params.id
    );

    console.log(
      "User ID:",
      req.user?.id
    );


    // ------------------------------------------
    // Authentication
    // ------------------------------------------

    if (!req.user?.id) {

      return res.status(401).json({

        success: false,

        message:
          "Authentication required",

      });

    }


    // ------------------------------------------
    // Check uploaded image
    // ------------------------------------------

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message:
          "Face image was not received",

      });

    }


    // ------------------------------------------
    // Check face embedding
    // ------------------------------------------

    if (!req.body.faceEmbedding) {

      return res.status(400).json({

        success: false,

        message:
          "Face embedding was not received",

      });

    }


    // ------------------------------------------
    // Find student
    // ------------------------------------------

    const student =
      await Student.findOne({

        _id:
          req.params.id,

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


    // ------------------------------------------
    // Parse face embedding
    // ------------------------------------------

    let faceEmbedding;

    try {

      faceEmbedding =
        JSON.parse(
          req.body.faceEmbedding
        );

    } catch (error) {

      console.error(
        "FACE EMBEDDING JSON ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        message:
          "Invalid face embedding format",

      });

    }


    // ------------------------------------------
    // Validate embedding array
    // ------------------------------------------

    if (
      !Array.isArray(
        faceEmbedding
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Face embedding must be an array",

      });

    }


    // ------------------------------------------
    // Validate 128 values
    // ------------------------------------------

    if (
      faceEmbedding.length !== 128
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Face embedding must contain exactly 128 values",

      });

    }


    // ------------------------------------------
    // Validate embedding values
    // ------------------------------------------

    for (
      const value of faceEmbedding
    ) {

      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid value inside face embedding",

        });

      }

    }


    // ==================================================
    // Upload image to Cloudinary
    // ==================================================

    console.log(
      "Uploading image to Cloudinary..."
    );


    const cloudinaryResult =
      await uploadToCloudinary(
        req.file.buffer
      );


    console.log(
      "Cloudinary upload successful"
    );


    console.log(
      "Cloudinary URL:",
      cloudinaryResult.secure_url
    );


    // ==================================================
    // Delete old Cloudinary image
    // ==================================================

    if (
      student.faceImage &&
      student.faceImage.includes(
        "res.cloudinary.com"
      )
    ) {

      try {

        const oldUrl =
          student.faceImage;

        const parts =
          oldUrl.split("/");

        const uploadIndex =
          parts.indexOf("upload");

        if (
          uploadIndex !== -1
        ) {

          let publicIdWithExtension =
            parts
              .slice(uploadIndex + 2)
              .join("/");

          const extensionIndex =
            publicIdWithExtension.lastIndexOf(
              "."
            );

          if (
            extensionIndex !== -1
          ) {

            publicIdWithExtension =
              publicIdWithExtension.substring(
                0,
                extensionIndex
              );

          }

          await cloudinary.uploader.destroy(
            publicIdWithExtension,
            {
              resource_type:
                "image",
            }
          );

          console.log(
            "Old Cloudinary image deleted"
          );

        }

      } catch (deleteError) {

        console.error(
          "OLD IMAGE DELETE ERROR:",
          deleteError.message
        );

        // Do not stop registration
      }

    }


    // ==================================================
    // Save Cloudinary URL
    // ==================================================

    student.faceImage =
      cloudinaryResult.secure_url;


    // ==================================================
    // Save face embedding
    // ==================================================

    student.faceEmbedding =
      faceEmbedding;


    // ==================================================
    // Save student
    // ==================================================

    await student.save();


    console.log(
      "FACE REGISTRATION SUCCESS:",
      student.name
    );

    console.log(
      "Saved Image URL:",
      student.faceImage
    );

    console.log(
      "Embedding length:",
      student.faceEmbedding.length
    );

    console.log(
      "======================================"
    );


    // ==================================================
    // Response
    // ==================================================

    return res.status(200).json({

      success: true,

      message:
        "Face registered successfully",

      data: student,

    });

  } catch (error) {

    console.error(
      "======================================"
    );

    console.error(
      "FACE REGISTRATION ERROR"
    );

    console.error(
      "Name:",
      error.name
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "======================================"
    );


    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Face registration failed",

    });

  }

};


// ==================================================
// Export Controllers
// ==================================================

module.exports = {

  createStudent,

  getAllStudents,

  deleteStudent,

  uploadFaceImage,

};
