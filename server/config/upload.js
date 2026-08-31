const multer = require("multer");


// ==========================================
// Store uploaded image temporarily in memory
// ==========================================

const storage = multer.memoryStorage();


// ==========================================
// Allowed image types
// ==========================================

const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );

  }
};


// ==========================================
// Multer configuration
// ==========================================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

});


module.exports = upload;
