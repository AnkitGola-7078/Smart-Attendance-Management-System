const axios = require("axios");
const FormData = require("form-data");

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");



const recognizeFace = async (req,res)=>{


try{


if(!req.file){

return res.status(400).json({

success:false,

message:"Image required"

});

}




// send image to python AI service

const formData = new FormData();


formData.append(

"image",

req.file.buffer,

{

filename:"face.jpg",

contentType:req.file.mimetype

}

);




const response = await axios.post(

"http://127.0.0.1:8000/recognize",

formData,

{

headers:formData.getHeaders()

}

);





if(!response.data.success){


return res.status(404).json({

success:false,

message:"Face not recognized"

});


}




const rollNumber = response.data.rollNumber;




// find student

const student = await Student.findOne({

rollNumber

});




if(!student){


return res.status(404).json({

success:false,

message:"Student not found"

});


}




// save attendance

const attendance = await Attendance.create({

student:student._id,

status:"Present",

method:"Face Recognition"

});




res.json({

success:true,

message:"Attendance marked",

student:{

name:student.name,

rollNumber:student.rollNumber

},

attendance

});




}catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}



};



module.exports = {

recognizeFace

};