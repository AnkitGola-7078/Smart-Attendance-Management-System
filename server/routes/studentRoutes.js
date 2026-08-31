const express = require("express");

const router = express.Router();

const upload =
  require("../config/upload");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createStudent,
  getAllStudents,
  deleteStudent,
  uploadFaceImage,
} = require("../controllers/studentController");


router.use(
  authMiddleware
);


router.post(
  "/",
  createStudent
);


router.get(
  "/",
  getAllStudents
);


router.delete(
  "/:id",
  deleteStudent
);


router.post(
  "/upload/:id",
  upload.single("faceImage"),
  uploadFaceImage
);


module.exports = router;
