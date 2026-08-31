import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

function AttendanceHistory() {
  const [history, setHistory] = useState([]);

  const [details, setDetails] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await API.get("/attendance/history");

      setHistory(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const viewAttendance = async (date) => {
    try {
      const response = await API.get(
        `/attendance/history/${date}`
      );

      setDetails(response.data.data);

      setSelectedDate(date);

      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.date.includes(search)
  );

  const calculatePercentage = (present, total) => {
    if (total === 0) return 0;

    return ((present / total) * 100).toFixed(2);
  };

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8 text-white pt-28 md:pt-0">

        {/* ================= TITLE ================= */}

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-400">
          Attendance History
        </h1>

        {/* ================= HISTORY ================= */}

        <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow">

          {/* Search */}

          <input
            type="text"
            placeholder="Search date (YYYY-MM-DD)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 p-3 rounded mb-6"
          />

          {/* ================= MOBILE CARDS ================= */}

          <div className="block md:hidden space-y-4">

            {filteredHistory.map((item) => (

              <div
                key={item.date}
                className="bg-slate-900 border border-slate-700 rounded-xl p-4"
              >

                {/* Date */}

                <div className="flex justify-between items-center mb-4">

                  <h2 className="text-lg font-bold text-green-400">
                    {item.date}
                  </h2>

                  <span className="text-sm text-gray-400">
                    {item.total} Students
                  </span>

                </div>

                {/* Statistics */}

                <div className="grid grid-cols-2 gap-3 mb-4">

                  <div className="bg-slate-800 p-3 rounded-lg text-center">

                    <p className="text-gray-400 text-sm">
                      Present
                    </p>

                    <p className="text-xl font-bold text-green-400">
                      {item.present}
                    </p>

                  </div>

                  <div className="bg-slate-800 p-3 rounded-lg text-center">

                    <p className="text-gray-400 text-sm">
                      Absent
                    </p>

                    <p className="text-xl font-bold text-red-400">
                      {item.absent}
                    </p>

                  </div>

                </div>

                {/* Percentage */}

                <div className="flex justify-between items-center mb-4">

                  <span className="text-gray-400">
                    Attendance
                  </span>

                  <span className="font-bold text-green-400">
                    {calculatePercentage(
                      item.present,
                      item.total
                    )}%
                  </span>

                </div>

                {/* View Button */}

                <button
                  onClick={() =>
                    viewAttendance(item.date)
                  }
                  className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded w-full"
                >
                  👁 View Attendance
                </button>

              </div>

            ))}

          </div>


          {/* ================= DESKTOP TABLE ================= */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-600">

                  <th className="p-3 text-left">
                    Date
                  </th>

                  <th>
                    Present
                  </th>

                  <th>
                    Absent
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Percentage
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredHistory.map((item) => (

                  <tr
                    key={item.date}
                    className="border-b border-slate-700"
                  >

                    <td className="p-3">
                      {item.date}
                    </td>

                    <td className="text-center text-green-400 font-bold">
                      {item.present}
                    </td>

                    <td className="text-center text-red-400 font-bold">
                      {item.absent}
                    </td>

                    <td className="text-center">
                      {item.total}
                    </td>

                    <td className="text-center font-bold text-green-400">
                      {calculatePercentage(
                        item.present,
                        item.total
                      )} %
                    </td>

                    <td className="text-center">

                      <button
                        onClick={() =>
                          viewAttendance(item.date)
                        }
                        className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded"
                      >
                        👁 View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* ================= MODAL ================= */}

        {showModal && (

          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-3 sm:p-6 z-50">

            <div className="bg-slate-800 rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-5xl max-h-[90vh] overflow-auto">

              {/* Modal Header */}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

                <h2 className="text-xl sm:text-2xl font-bold text-green-400">

                  Attendance Details

                  <span className="block text-sm sm:text-base text-gray-300 mt-1">
                    {selectedDate}
                  </span>

                </h2>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded w-full sm:w-auto"
                >
                  Close
                </button>

              </div>


              {/* ================= MOBILE DETAILS ================= */}

              <div className="block md:hidden space-y-3">

                {details.map((record) => (

                  <div
                    key={record._id}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                  >

                    <div className="flex justify-between mb-3">

                      <div>

                        <p className="font-bold">
                          {record.student?.name}
                        </p>

                        <p className="text-sm text-gray-400">
                          Roll: {record.student?.rollNumber}
                        </p>

                      </div>

                      <div>

                        <span
                          className={
                            record.status === "Present"
                              ? "text-green-400 font-bold"
                              : "text-red-400 font-bold"
                          }
                        >
                          {record.status === "Present"
                            ? "✅ Present"
                            : "❌ Absent"}
                        </span>

                      </div>

                    </div>

                    <div className="text-sm text-gray-400">

                      Method:
                      <span className="text-white ml-2">
                        {record.method}
                      </span>

                    </div>

                  </div>

                ))}

              </div>


              {/* ================= DESKTOP DETAILS ================= */}

              <div className="hidden md:block overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-slate-600">

                      <th className="p-3 text-left">
                        Roll Number
                      </th>

                      <th>
                        Name
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Method
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {details.map((record) => (

                      <tr
                        key={record._id}
                        className="border-b border-slate-700"
                      >

                        <td className="p-3 text-center">
                          {record.student?.rollNumber}
                        </td>

                        <td className="text-center">
                          {record.student?.name}
                        </td>

                        <td className="text-center">

                          <span
                            className={
                              record.status === "Present"
                                ? "text-green-400 font-bold"
                                : "text-red-400 font-bold"
                            }
                          >

                            {record.status === "Present"
                              ? "✅ Present"
                              : "❌ Absent"}

                          </span>

                        </td>

                        <td className="text-center">
                          {record.method}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default AttendanceHistory;
