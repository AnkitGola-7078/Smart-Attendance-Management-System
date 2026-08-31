import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Clear previous user session when login page opens
  useEffect(() => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

  }, []);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post("/auth/login", {

        email,

        password

      });

      console.log(response.data);

      // Save current user token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save current user details
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(
        error.response?.data || error.message
      );

      alert("Login Failed");

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8">

        {/* Logo / App Name */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-600 flex items-center justify-center shadow-md">

            <span className="text-white text-3xl sm:text-4xl">
              ✓
            </span>

          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-green-600">

            Smart Attendance

          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">

            Teacher / Admin Login

          </p>

        </div>


        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Email

            </label>

            <input

              type="email"

              placeholder="Enter your email"

              className="w-full border border-gray-300 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

            />

          </div>


          {/* Password */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Password

            </label>

            <input

              type="password"

              placeholder="Enter your password"

              className="w-full border border-gray-300 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

            />

          </div>


          {/* Login Button */}

          <button

            type="submit"

            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-green-700 active:scale-[0.98] transition"

          >

            Login

          </button>

        </form>


        {/* Register */}

        <p className="text-center mt-7 text-gray-600 text-sm sm:text-base">

          Don't have an account?{" "}

          <Link

            to="/register"

            className="text-green-600 font-semibold hover:underline"

          >

            Create Account

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;
