const express = require("express");
const router = express.Router();

const multer = require("multer");


const {
    recognizeFace
}=require("../controllers/faceController");



const upload = multer({

storage:multer.memoryStorage()

});



router.post(

"/recognize",

upload.single("image"),

recognizeFace

);



module.exports = router;