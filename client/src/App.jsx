import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import AttendanceReport from "./pages/AttendanceReport";
import StudentQRAttendance from "./pages/StudentQRAttendance";
import FaceAttendance from "./pages/FaceAttendance";
import WorkingDays from "./pages/WorkingDays";



function App() {


  return (


    <BrowserRouter>


      <Routes>



        {/* Login */}

        <Route

          path="/"

          element={<Login />}

        />



        {/* Register */}

        <Route

          path="/register"

          element={<Register />}

        />



        {/* Dashboard */}

        <Route

          path="/dashboard"

          element={<Dashboard />}

        />



        {/* Students */}

        <Route

          path="/students"

          element={<Students />}

        />



        {/* Attendance */}

        <Route

          path="/attendance"

          element={<Attendance />}

        />



        {/* Attendance History */}

        <Route

          path="/attendance-history"

          element={<AttendanceHistory />}

        />



        {/* Attendance Report */}

        <Route

          path="/attendance-report"

          element={<AttendanceReport />}

        />



        {/* Working Days */}

        <Route

          path="/working-days"

          element={<WorkingDays />}

        />



        {/* Student QR Attendance */}

        <Route

          path="/student-attendance/:token"

          element={<StudentQRAttendance />}

        />



        {/* Face Attendance */}

        <Route

          path="/face-attendance"

          element={<FaceAttendance />}

        />



      </Routes>


    </BrowserRouter>


  );

}


export default App;