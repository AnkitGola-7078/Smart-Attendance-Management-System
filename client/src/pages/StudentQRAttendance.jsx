import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function StudentQRAttendance() {

  const { token } = useParams();

  const [rollNumber, setRollNumber] = useState(
    localStorage.getItem("rollNumber") || ""
  );

  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState(null);

  const submitAttendance = async () => {

    if (!rollNumber.trim()) {

      alert("Please enter Roll Number");

      return;

    }

    try {

      setLoading(true);

      const response = await API.post("/qr/mark", {

        token,

        rollNumber

      });

      localStorage.setItem("rollNumber", rollNumber);

      setStudent(response.data.student);

      alert(response.data.message);

    }

    catch(error){

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Unable to mark attendance"

      );

    }

    finally{

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen bg-blue-100 flex justify-center items-center">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[450px]">

        <h1 className="text-3xl font-bold text-center mb-2">

          Smart Attendance System

        </h1>

        <p className="text-center text-gray-500 mb-6">

          QR Attendance

        </p>

        <input

          type="text"

          placeholder="Enter Roll Number"

          value={rollNumber}

          onChange={(e)=>setRollNumber(e.target.value)}

          className="w-full border rounded-lg p-3 mb-5"

        />

        <button

          onClick={submitAttendance}

          disabled={loading}

          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"

        >

          {

            loading

            ?

            "Please Wait..."

            :

            "Mark Attendance"

          }

        </button>



        {

          student && (

            <div className="mt-8 border-t pt-5">

              <h2 className="text-xl font-bold mb-3">

                Attendance Marked Successfully

              </h2>

              <p>

                <b>Name :</b> {student.name}

              </p>

              <p>

                <b>Roll Number :</b> {student.rollNumber}

              </p>

              <p>

                <b>Department :</b> {student.department}

              </p>

              <p>

                <b>Year :</b> {student.year}

              </p>

              <p>

                <b>Section :</b> {student.section}

              </p>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default StudentQRAttendance;