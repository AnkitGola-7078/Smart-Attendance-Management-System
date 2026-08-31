import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Teacher"
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      await API.post("/auth/register", formData);

      alert("Account created successfully");

      navigate("/");

    } catch (error) {

      console.log(error.response?.data);
      alert("Registration failed");

    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Create Account
        </h1>


        <form onSubmit={handleRegister} className="mt-6">


          <input
            name="name"
            placeholder="Name"
            className="w-full border p-3 rounded-lg mb-4"
            onChange={handleChange}
          />


          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg mb-4"
            onChange={handleChange}
          />


          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg mb-4"
            onChange={handleChange}
          />


          <select
            name="role"
            className="w-full border p-3 rounded-lg mb-5"
            onChange={handleChange}
          >
            <option value="Teacher">
              Teacher
            </option>

            <option value="Admin">
              Admin
            </option>

          </select>


          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Register
          </button>


        </form>

      </div>

    </div>
  );
}

export default Register;