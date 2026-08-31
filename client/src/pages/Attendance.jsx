import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import { QRCodeCanvas } from "qrcode.react";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [method, setMethod] = useState("Manual");
  const [qrUrl, setQrUrl] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // ======================
  // Fetch Students
  // ======================
  const fetchStudents = async () => {
    try {
      const response = await API.get("/students");
      setStudents(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ======================
  // Toggle Present / Absent
  // ======================
  const markStatus = (id, status) => {
    setAttendance((prev) => {
      const updated = { ...prev };

      if (updated[id] === status) {
        delete updated[id];
      } else {
        updated[id] = status;
      }

      return updated;
    });
  };

  // ======================
  // Mark All Present
  // ======================
  const markAllPresent = () => {
    const data = {};

    students.forEach((student) => {
      data[student._id] = "Present";
    });

    setAttendance(data);
  };

  // ======================
  // Mark All Absent
  // ======================
  const markAllAbsent = () => {
    const data = {};

    students.forEach((student) => {
      data[student._id] = "Absent";
    });

    setAttendance(data);
  };

  const presentCount = Object.values(attendance).filter(
    (item) => item === "Present"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (item) => item === "Absent"
  ).length;

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  // ======================
  // Save Attendance
  // ======================
  const saveAttendance = async () => {
    if (saving) return;

    if (Object.keys(attendance).length === 0) {
      alert("Please mark attendance");
      return;
    }

    setSaving(true);

    try {
      for (const id in attendance) {
        await API.post("/attendance", {
          student: id,
          status: attendance[id],
          method: "Manual",
        });
      }

      alert("Attendance Saved Successfully");

      setAttendance({});
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // Generate QR
  // ======================
  const generateQR = async () => {
    try {
      const response = await API.post("/qr/generate");

      const token = response.data.token;

      const url = `${window.location.origin}/student-attendance/${token}`;

      setQrUrl(url);
    } catch (error) {
      console.log(error);
      alert("QR generation failed");
    }
  };

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 pt-28 md:pt-0 bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8 text-white overflow-x-hidden">

        <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-green-400">
          Mark Attendance
        </h1>

        {/* ================= Attendance Method ================= */}

        <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow mb-5 sm:mb-6">

          <h2 className="text-lg sm:text-xl font-bold mb-5 text-green-400">
            Select Attendance Method
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "Manual"}
                onChange={() => setMethod("Manual")}
              />
              Manual
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "QR"}
                onChange={() => setMethod("QR")}
              />
              QR Code
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "Face"}
                onChange={() => setMethod("Face")}
              />
              Face Recognition
            </label>

          </div>
        </div>


        {/* ================= QR Attendance ================= */}

        {method === "QR" && (

          <div className="bg-slate-800 p-5 sm:p-8 rounded-xl shadow text-center">

            <button
              onClick={generateQR}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded w-full sm:w-auto"
            >
              Generate QR Code
            </button>

            {qrUrl && (

              <div className="mt-6 flex flex-col items-center">

                <div className="bg-white p-4 rounded-xl inline-block">

                  <QRCodeCanvas
                    value={qrUrl}
                    size={220}
                  />

                </div>

                <p className="mt-4">
                  Scan QR to mark attendance
                </p>

              </div>

            )}

          </div>

        )}


        {/* ================= Face Attendance ================= */}

        {method === "Face" && (

          <div className="bg-slate-800 p-6 sm:p-10 rounded-xl shadow text-center">

            <h2 className="text-xl sm:text-2xl font-bold text-green-400">
              Face Recognition Attendance
            </h2>

            <p className="mt-3 text-gray-300">
              Open camera and verify student face
            </p>

            <button
              onClick={() =>
                (window.location.href = "/face-attendance")
              }
              className="mt-6 bg-green-600 hover:bg-green-700 px-8 py-3 rounded w-full sm:w-auto"
            >
              Start Face Recognition
            </button>

          </div>

        )}


        {/* ================= Manual Attendance ================= */}

        {method === "Manual" && (

          <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow">

            {/* Summary */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-5 sm:mb-6">

              <div className="bg-slate-700 p-4 sm:p-5 rounded-xl">

                <h3>
                  Total Students
                </h3>

                <p className="text-2xl sm:text-3xl font-bold text-green-400">
                  {students.length}
                </p>

              </div>

              <div className="bg-slate-700 p-4 sm:p-5 rounded-xl">

                <h3>
                  Present
                </h3>

                <p className="text-2xl sm:text-3xl font-bold text-green-400">
                  {presentCount}
                </p>

              </div>

              <div className="bg-slate-700 p-4 sm:p-5 rounded-xl">

                <h3>
                  Absent
                </h3>

                <p className="text-2xl sm:text-3xl font-bold text-red-400">
                  {absentCount}
                </p>

              </div>

            </div>


            {/* Search */}

            <input
              type="text"
              placeholder="Search student name or roll number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 p-3 rounded mb-5"
            />


            {/* Mark All */}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">

              <button
                onClick={markAllPresent}
                className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded w-full sm:w-auto"
              >
                Mark All Present
              </button>

              <button
                onClick={markAllAbsent}
                className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded w-full sm:w-auto"
              >
                Mark All Absent
              </button>

            </div>


            {/* ================= MOBILE STUDENTS ================= */}

            <div className="block md:hidden space-y-4">

              {filteredStudents.map((student) => (

                <div
                  key={student._id}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                >

                  <div className="mb-4">

                    <h3 className="font-bold text-lg">
                      {student.name}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      Roll Number: {student.rollNumber}
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        markStatus(
                          student._id,
                          "Present"
                        )
                      }
                      className={`py-3 rounded text-white font-semibold ${
                        attendance[student._id] === "Present"
                          ? "bg-green-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      ✓ Present
                    </button>

                    <button
                      onClick={() =>
                        markStatus(
                          student._id,
                          "Absent"
                        )
                      }
                      className={`py-3 rounded text-white font-semibold ${
                        attendance[student._id] === "Absent"
                          ? "bg-red-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      ✕ Absent
                    </button>

                  </div>

                </div>

              ))}

            </div>


            {/* ================= DESKTOP TABLE ================= */}

            <div className="hidden md:block overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-600">

                    <th className="p-3 text-left">
                      Name
                    </th>

                    <th className="text-center">
                      Roll Number
                    </th>

                    <th className="text-center">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredStudents.map((student) => (

                    <tr
                      key={student._id}
                      className="border-b border-slate-700"
                    >

                      <td className="p-3">
                        {student.name}
                      </td>

                      <td className="text-center">
                        {student.rollNumber}
                      </td>

                      <td className="text-center">

                        <button
                          onClick={() =>
                            markStatus(
                              student._id,
                              "Present"
                            )
                          }
                          className={`px-4 py-2 rounded mr-3 text-white ${
                            attendance[student._id] === "Present"
                              ? "bg-green-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          Present
                        </button>

                        <button
                          onClick={() =>
                            markStatus(
                              student._id,
                              "Absent"
                            )
                          }
                          className={`px-4 py-2 rounded text-white ${
                            attendance[student._id] === "Absent"
                              ? "bg-red-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Absent
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* Save */}

            <button
              onClick={saveAttendance}
              disabled={saving}
              className={`mt-6 px-8 py-3 rounded text-white w-full sm:w-auto ${
                saving
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {saving
                ? "Saving Attendance..."
                : "Save Attendance"}
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Attendance;
