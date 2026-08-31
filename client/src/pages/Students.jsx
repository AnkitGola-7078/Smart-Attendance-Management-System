import {
  useEffect,
  useRef,
  useState,
} from "react";

import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import * as faceapi from "face-api.js";

function Students() {

  const [students, setStudents] =
    useState([]);

  const [uploadStudentId, setUploadStudentId] =
    useState(null);

  const [student, setStudent] = useState({
    name: "",
    rollNumber: "",
    email: "",
    department: "",
    year: "",
    section: "",
  });

  const fileRef = useRef(null);

  const [faceModelsReady, setFaceModelsReady] =
    useState(false);

  const [loadingFaceModels, setLoadingFaceModels] =
    useState(false);


  // ==========================================
  // Load students when page opens
  // ==========================================

  useEffect(() => {

    fetchStudents();

  }, []);


  // ==========================================
  // Fetch students
  // ==========================================

  const fetchStudents = async () => {

    try {

      const response =
        await API.get("/students");

      console.log(
        "STUDENTS FROM SERVER:",
        response.data.data
      );

      setStudents(
        response.data.data
      );

    } catch (error) {

      console.error(
        "FETCH STUDENTS ERROR:",
        error
      );

    }

  };


  // ==========================================
  // Load face-api models
  // ==========================================

  const loadFaceModels = async () => {

    if (faceModelsReady) {
      return true;
    }

    try {

      setLoadingFaceModels(true);

      const MODEL_URL =
        "/face-models";


      await faceapi.nets.tinyFaceDetector.loadFromUri(
        MODEL_URL
      );


      await faceapi.nets.faceLandmark68Net.loadFromUri(
        MODEL_URL
      );


      await faceapi.nets.faceRecognitionNet.loadFromUri(
        MODEL_URL
      );


      setFaceModelsReady(true);


      console.log(
        "Face recognition models loaded"
      );


      return true;

    } catch (error) {

      console.error(
        "FACE MODEL LOADING ERROR:",
        error
      );


      alert(
        "Face recognition models could not be loaded. Please check the face-models folder."
      );


      return false;

    } finally {

      setLoadingFaceModels(false);

    }

  };


  // ==========================================
  // Handle student form
  // ==========================================

  const handleChange = (e) => {

    setStudent({

      ...student,

      [e.target.name]:
        e.target.value,

    });

  };


  // ==========================================
  // Add student
  // ==========================================

  const addStudent = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/students",
        {
          ...student,
          year: Number(
            student.year
          ),
        }
      );


      alert(
        "Student Added Successfully"
      );


      setStudent({
        name: "",
        rollNumber: "",
        email: "",
        department: "",
        year: "",
        section: "",
      });


      fetchStudents();

    } catch (error) {

      console.error(
        "ADD STUDENT ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
          "Failed to add student"
      );

    }

  };


  // ==========================================
  // Delete student
  // ==========================================

  const deleteStudent = async (id) => {

    try {

      await API.delete(
        `/students/${id}`
      );


      alert(
        "Student Deleted Successfully"
      );


      fetchStudents();

    } catch (error) {

      console.error(
        "DELETE STUDENT ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );

    }

  };


  // ==========================================
  // Open face upload
  // ==========================================

  const openUpload = async (id) => {

    const ready =
      await loadFaceModels();


    if (!ready) {
      return;
    }


    setUploadStudentId(id);


    if (fileRef.current) {

      fileRef.current.value = "";

    }


    fileRef.current?.click();

  };


  // ==========================================
  // Upload face
  // ==========================================

  const handleUpload = async (e) => {

    const file =
      e.target.files[0];


    if (!file) {
      return;
    }


    try {

      console.log(
        "================================"
      );

      console.log(
        "FACE REGISTRATION STARTED"
      );

      console.log(
        "File:",
        file.name
      );


      const ready =
        await loadFaceModels();


      if (!ready) {
        return;
      }


      // ========================================
      // Create temporary image URL
      // ========================================

      const imageUrl =
        URL.createObjectURL(file);


      const img =
        await faceapi.fetchImage(
          imageUrl
        );


      console.log(
        "Image loaded:",
        img.width,
        "x",
        img.height
      );


      // ========================================
      // Detect face
      // ========================================

      const detection =
        await faceapi
          .detectSingleFace(
            img,
            new faceapi.TinyFaceDetectorOptions(
              {
                inputSize: 320,
                scoreThreshold: 0.3,
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor();


      URL.revokeObjectURL(
        imageUrl
      );


      if (!detection) {

        alert(
          "No face detected. Please upload a clear front-facing photo."
        );

        return;

      }


      console.log(
        "Face detected"
      );


      console.log(
        "Detection score:",
        detection.detection.score
      );


      // ========================================
      // Generate 128-value embedding
      // ========================================

      const faceEmbedding =
        Array.from(
          detection.descriptor
        );


      console.log(
        "Embedding length:",
        faceEmbedding.length
      );


      if (
        faceEmbedding.length !== 128
      ) {

        alert(
          "Unable to generate face descriptor."
        );

        return;

      }


      // ========================================
      // Create FormData
      // ========================================

      const formData =
        new FormData();


      formData.append(
        "faceImage",
        file
      );


      formData.append(
        "faceEmbedding",
        JSON.stringify(
          faceEmbedding
        )
      );


      console.log(
        "Sending face registration to backend..."
      );


      // ========================================
      // Send to backend
      // ========================================

      const response =
        await API.post(
          `/students/upload/${uploadStudentId}`,
          formData
        );


      console.log(
        "SERVER RESPONSE:",
        response.data
      );


      if (
        response.data.success
      ) {

        alert(
          "Face registered successfully!"
        );


        // ======================================
        // IMPORTANT
        // Refresh students from MongoDB
        // ======================================

        await fetchStudents();


        console.log(
          "Updated student:",
          response.data.data
        );


        console.log(
          "Cloudinary image URL:",
          response.data.data.faceImage
        );

      }

      console.log(
        "================================"
      );

    } catch (error) {

      console.error(
        "FACE REGISTRATION ERROR:",
        error
      );


      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );


      console.error(
        "STATUS:",
        error.response?.status
      );


      const serverMessage =
        error.response?.data?.message;


      alert(
        serverMessage ||
          "Face registration failed"
      );

    }


    e.target.value = "";

  };


  // ==========================================
  // Render
  // ==========================================

  return (

    <div className="flex min-h-screen">

      <Sidebar />


      <div className="flex-1 pt-28 md:pt-0 p-4 sm:p-6 lg:p-8 bg-slate-900 min-h-screen text-white overflow-x-hidden">


        {/* ======================================
            TITLE
        ====================================== */}

        <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-green-400">

          Students

        </h1>


        {/* ======================================
            ADD STUDENT
        ====================================== */}

        <form
          onSubmit={addStudent}
          className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow mb-6 sm:mb-8"
        >

          <h2 className="text-lg sm:text-xl font-bold mb-4 text-green-400">

            Add Student

          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            {[
              "name",
              "rollNumber",
              "email",
              "department",
              "year",
              "section",
            ].map((field) => (

              <input
                key={field}
                name={field}
                placeholder={field}
                value={student[field]}
                onChange={handleChange}
                required
                className="bg-slate-900 border border-slate-600 p-3 rounded text-white w-full"
              />

            ))}

          </div>


          <button
            type="submit"
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded w-full sm:w-auto"
          >

            Add Student

          </button>

        </form>


        {/* ======================================
            STUDENT LIST
        ====================================== */}

        <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow">


          <h2 className="text-lg sm:text-xl font-bold mb-4 text-green-400">

            Student List

          </h2>


          {/* ====================================
              HIDDEN FILE INPUT
          ==================================== */}

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            hidden
            onChange={handleUpload}
          />


          {/* ====================================
              MOBILE STUDENT CARDS
          ==================================== */}

          <div className="block md:hidden space-y-4">

            {students.map((s) => (

              <div
                key={s._id}
                className="bg-slate-900 rounded-xl p-4 border border-slate-700"
              >


                {/* Student image + name */}

                <div className="flex items-center gap-4 mb-4">


                  {s.faceImage ? (

                    <img
                      src={s.faceImage}
                      alt={s.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                      onError={() => {
                        console.error(
                          "CLOUDINARY IMAGE FAILED:",
                          s.faceImage
                        );
                      }}
                    />

                  ) : (

                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-gray-400 text-xs text-center">

                      No Photo

                    </div>

                  )}


                  <div>

                    <h3 className="font-bold text-lg">

                      {s.name}

                    </h3>


                    <p className="text-gray-400 text-sm">

                      Roll No: {s.rollNumber}

                    </p>

                  </div>

                </div>


                {/* Student details */}

                <div className="space-y-2 text-sm">

                  <p>

                    <span className="text-gray-400">

                      Department:

                    </span>{" "}

                    {s.department}

                  </p>


                  <p>

                    <span className="text-gray-400">

                      Year:

                    </span>{" "}

                    {s.year}

                  </p>


                  <p>

                    <span className="text-gray-400">

                      Section:

                    </span>{" "}

                    {s.section}

                  </p>

                </div>


                {/* Face registration */}

                <div className="mt-4">


                  <button
                    type="button"
                    onClick={() =>
                      openUpload(s._id)
                    }
                    disabled={loadingFaceModels}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-3 py-3 rounded w-full"
                  >

                    📷{" "}

                    {loadingFaceModels
                      ? "Loading..."
                      : s.faceImage
                      ? "Update Face"
                      : "Register Face"}

                  </button>


                  {s.faceEmbedding &&
                  s.faceEmbedding.length ===
                    128 ? (

                    <p className="text-green-400 text-sm mt-2 text-center">

                      ✓ Face Registered

                    </p>

                  ) : null}


                  <button
                    type="button"
                    onClick={() =>
                      deleteStudent(s._id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-3 rounded w-full mt-3"
                  >

                    Delete

                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* ====================================
              DESKTOP TABLE
          ==================================== */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-600">

                  <th className="p-3 text-left">

                    Name

                  </th>


                  <th className="text-center">

                    Roll No

                  </th>


                  <th className="text-center">

                    Department

                  </th>


                  <th className="text-center">

                    Year

                  </th>


                  <th className="text-center">

                    Face

                  </th>


                  <th className="text-center">

                    Action

                  </th>

                </tr>

              </thead>


              <tbody>

                {students.map((s) => (

                  <tr
                    key={s._id}
                    className="border-b border-slate-700"
                  >


                    <td className="p-3">

                      {s.name}

                    </td>


                    <td className="text-center">

                      {s.rollNumber}

                    </td>


                    <td className="text-center">

                      {s.department}

                    </td>


                    <td className="text-center">

                      {s.year}

                    </td>


                    {/* =========================
                        FACE COLUMN
                    ========================= */}

                    <td className="text-center">


                      {s.faceImage ? (

                        <img
                          src={s.faceImage}
                          alt={s.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-green-500"
                          onError={() => {
                            console.error(
                              "CLOUDINARY IMAGE FAILED:",
                              s.faceImage
                            );
                          }}
                        />

                      ) : (

                        <p className="text-gray-400 mb-2">

                          No Photo

                        </p>

                      )}


                      <button
                        type="button"
                        onClick={() =>
                          openUpload(s._id)
                        }
                        disabled={loadingFaceModels}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-3 py-2 rounded"
                      >

                        📷{" "}

                        {loadingFaceModels
                          ? "Loading..."
                          : s.faceImage
                          ? "Update Face"
                          : "Register Face"}

                      </button>


                      {s.faceEmbedding &&
                      s.faceEmbedding.length ===
                        128 ? (

                        <p className="text-green-400 text-sm mt-2">

                          ✓ Face Registered

                        </p>

                      ) : null}


                    </td>


                    {/* =========================
                        DELETE
                    ========================= */}

                    <td className="text-center">

                      <button
                        type="button"
                        onClick={() =>
                          deleteStudent(s._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >

                        Delete

                      </button>

                    </td>


                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ====================================
              NO STUDENTS
          ==================================== */}

          {students.length === 0 && (

            <div className="text-center text-gray-400 py-8">

              No students found.

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default Students;
