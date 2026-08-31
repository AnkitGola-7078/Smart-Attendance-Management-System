import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950 text-white h-16 flex items-center px-4 shadow-lg">

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl mr-4"
        >
          ☰
        </button>

        <h1 className="text-xl font-bold text-green-400">
          Smart Attendance
        </h1>

      </div>


      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-60"
          onClick={closeMenu}
        >

          <div
            className="absolute left-0 top-16 bottom-0 w-72 bg-slate-950 text-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <nav className="space-y-3">

              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="block p-4 rounded-lg hover:bg-green-600 transition"
              >
                📊 Dashboard
              </Link>


              <Link
                to="/students"
                onClick={closeMenu}
                className="block p-4 rounded-lg hover:bg-green-600 transition"
              >
                👨‍🎓 Students
              </Link>


              <Link
                to="/attendance"
                onClick={closeMenu}
                className="block p-4 rounded-lg hover:bg-green-600 transition"
              >
                📝 Attendance
              </Link>


              <Link
                to="/attendance-history"
                onClick={closeMenu}
                className="block p-4 rounded-lg hover:bg-green-600 transition"
              >
                🕐 Attendance History
              </Link>


              <Link
                to="/attendance-report"
                onClick={closeMenu}
                className="block p-4 rounded-lg hover:bg-green-600 transition"
              >
                📈 Attendance Report
              </Link>


              <Link
                to="/working-days"
                onClick={closeMenu}
                className="block p-4 rounded-lg hover:bg-green-600 transition"
              >
                📅 Working Days
              </Link>

            </nav>

          </div>

        </div>
      )}


      {/* ================= DESKTOP SIDEBAR ================= */}

      <div className="hidden md:block h-screen w-64 bg-slate-950 text-white p-5 shadow-xl">

        <h1 className="text-2xl font-bold mb-10 text-green-400">
          Smart Attendance
        </h1>

        <nav className="space-y-5">

          <Link
            to="/dashboard"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Dashboard
          </Link>


          <Link
            to="/students"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Students
          </Link>


          <Link
            to="/attendance"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Attendance
          </Link>


          <Link
            to="/attendance-history"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Attendance History
          </Link>


          <Link
            to="/attendance-report"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Attendance Report
          </Link>


          <Link
            to="/working-days"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Working Days
          </Link>

        </nav>

      </div>
    </>
  );
}

export default Sidebar;
