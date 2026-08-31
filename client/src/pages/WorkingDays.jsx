import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";


function WorkingDays() {

  const [academicYear, setAcademicYear] = useState("");

  const [totalDays, setTotalDays] = useState("");

  const [currentData, setCurrentData] = useState(null);

  const [loading, setLoading] = useState(false);


  // ==========================================
  // FETCH CURRENT USER'S WORKING DAYS
  // ==========================================

  const fetchWorkingDays = async () => {

    try {

      const response =
        await API.get("/working-days");

      setCurrentData(
        response.data.data
      );

    }

    catch (error) {

      console.error(
        "FETCH WORKING DAYS ERROR:",
        error
      );

    }

  };


  // ==========================================
  // LOAD WORKING DAYS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    fetchWorkingDays();

  }, []);


  // ==========================================
  // SAVE / UPDATE WORKING DAYS
  // ==========================================

  const saveWorkingDays = async (e) => {

    e.preventDefault();


    if (!academicYear.trim()) {

      alert("Please enter academic year");

      return;

    }


    if (!totalDays || Number(totalDays) <= 0) {

      alert(
        "Please enter valid working days"
      );

      return;

    }


    try {

      setLoading(true);


      await API.post(
        "/working-days",
        {

          academicYear:
            academicYear.trim(),

          totalDays:
            Number(totalDays),

        }
      );


      alert(
        "Working days saved successfully"
      );


      setAcademicYear("");

      setTotalDays("");


      // Refresh current data
      await fetchWorkingDays();

    }

    catch (error) {

      console.error(
        "SAVE WORKING DAYS ERROR:",
        error
      );


      alert(

        error.response?.data?.message ||

        "Failed to save working days"

      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div className="flex bg-black min-h-screen">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar />


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="flex-1 p-8 bg-black min-h-screen">


        {/* ===================================
            TITLE
        =================================== */}

        <h1 className="text-3xl font-bold mb-6 text-green-400">

          Working Days Management

        </h1>


        {/* ===================================
            FORM
        =================================== */}

        <form

          onSubmit={saveWorkingDays}

          className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-xl border border-green-600"

        >


          <h2 className="text-xl font-bold mb-5 text-white">

            Enter Academic Working Days

          </h2>


          {/* Academic Year */}

          <input

            type="text"

            placeholder="Academic Year (Example: 2026-2027)"

            value={academicYear}

            onChange={(e) =>
              setAcademicYear(e.target.value)
            }

            className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"

          />


          {/* Total Working Days */}

          <input

            type="number"

            min="1"

            placeholder="Total Working Days"

            value={totalDays}

            onChange={(e) =>
              setTotalDays(e.target.value)
            }

            className="w-full bg-black text-white border border-gray-700 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"

          />


          {/* Save Button */}

          <button

            type="submit"

            disabled={loading}

            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-black px-6 py-3 rounded-lg w-full font-bold"

          >

            {loading
              ? "Saving..."
              : "Save Working Days"}

          </button>


        </form>


        {/* ===================================
            CURRENT WORKING DAYS
        =================================== */}

        {

          currentData && (

            <div className="bg-gray-900 p-6 rounded-xl shadow-lg mt-6 max-w-xl border border-green-600">


              <h2 className="text-xl font-bold mb-5 text-green-400">

                Current Working Days

              </h2>


              <div className="space-y-3">


                {/* Academic Year */}

                <div className="bg-black border border-gray-700 p-4 rounded-lg">

                  <p className="text-gray-400">

                    Academic Year

                  </p>


                  <p className="text-xl font-bold text-green-400">

                    {currentData.academicYear}

                  </p>

                </div>


                {/* Total Days */}

                <div className="bg-black border border-gray-700 p-4 rounded-lg">

                  <p className="text-gray-400">

                    Total Working Days

                  </p>


                  <p className="text-xl font-bold text-green-400">

                    {currentData.totalDays}

                  </p>

                </div>


              </div>


            </div>

          )

        }


      </div>

    </div>

  );

}


export default WorkingDays;
