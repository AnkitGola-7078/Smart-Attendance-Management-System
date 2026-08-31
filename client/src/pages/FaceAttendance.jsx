import {
  useEffect,
  useRef,
  useState,
} from "react";

import * as faceapi from "face-api.js";

import Webcam from "react-webcam";

import Sidebar from "../components/Sidebar";

import API from "../api/axios";

function FaceAttendance() {

  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] =
    useState(false);

  const [students, setStudents] =
    useState([]);

  const [processing, setProcessing] =
    useState(false);

  const [message, setMessage] =
    useState(
      "Loading face recognition models..."
    );

  // ==========================================
  // Camera
  // ==========================================

  const [facingMode, setFacingMode] =
    useState("user");

  // ==========================================
  // Load models and students
  // ==========================================

  useEffect(() => {

    loadModels();

    fetchStudents();

  }, []);

  // ==========================================
  // Load face-api models
  // ==========================================

  const loadModels = async () => {

    try {

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

      setModelsLoaded(true);

      setMessage(
        "Models loaded. Ready for recognition."
      );

    } catch (error) {

      console.error(
        "MODEL LOADING ERROR:",
        error
      );

      setMessage(
        "Failed to load face recognition models."
      );
    }
  };

  // ==========================================
  // Fetch only registered students
  // ==========================================

  const fetchStudents = async () => {

    try {

      const response =
        await API.get(
          "/students"
        );

      const allStudents =
        response.data.data;

      const registeredStudents =
        allStudents.filter(
          (student) =>
            Array.isArray(
              student.faceEmbedding
            ) &&
            student.faceEmbedding.length ===
              128
        );

      setStudents(
        registeredStudents
      );

      console.log(
        "REGISTERED STUDENTS:",
        registeredStudents
      );

    } catch (error) {

      console.error(
        "STUDENT LOADING ERROR:",
        error
      );

      setMessage(
        "Failed to load students."
      );
    }
  };

  // ==========================================
  // Switch Camera
  // ==========================================

  const switchCamera = () => {

    setFacingMode((currentMode) =>
      currentMode === "user"
        ? "environment"
        : "user"
    );

  };

  // ==========================================
  // Calculate Euclidean Distance
  // ==========================================

  const getDistance = (
    descriptor1,
    descriptor2
  ) => {

    let sum = 0;

    for (
      let i = 0;
      i < descriptor1.length;
      i++
    ) {

      const difference =
        descriptor1[i] -
        descriptor2[i];

      sum +=
        difference *
        difference;
    }

    return Math.sqrt(sum);
  };

  // ==========================================
  // Capture and recognize
  // ==========================================

  const capture = async () => {

    if (processing) {
      return;
    }

    if (!modelsLoaded) {

      alert(
        "Models are still loading..."
      );

      return;
    }

    if (
      students.length === 0
    ) {

      alert(
        "No registered faces found."
      );

      return;
    }

    if (
      !webcamRef.current
    ) {

      alert(
        "Camera is not available."
      );

      return;
    }

    setProcessing(true);

    setMessage(
      "Scanning face..."
    );

    try {

      // ========================================
      // Capture image
      // ========================================

      const imageSrc =
        webcamRef.current.getScreenshot();

      if (!imageSrc) {

        alert(
          "Could not capture image."
        );

        setMessage(
          "Camera capture failed."
        );

        return;
      }

      // ========================================
      // Convert screenshot
      // ========================================

      const img =
        await faceapi.fetchImage(
          imageSrc
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
                inputSize: 416,
                scoreThreshold: 0.6,
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

      if (!detection) {

        alert(
          "No face detected. Please look at the camera."
        );

        setMessage(
          "No face detected."
        );

        return;
      }

      // ========================================
      // Current descriptor
      // ========================================

      const currentDescriptor =
        Array.from(
          detection.descriptor
        );

      console.log(
        "Current descriptor length:",
        currentDescriptor.length
      );

      // ========================================
      // Find BEST match
      // ========================================

      let bestMatch = null;

      let bestDistance =
        Infinity;

      students.forEach(
        (student) => {

          const registered =
            student.faceEmbedding;

          if (
            !Array.isArray(
              registered
            )
          ) {
            return;
          }

          if (
            registered.length !== 128
          ) {
            return;
          }

          const distance =
            getDistance(
              currentDescriptor,
              registered
            );

          console.log(
            `${student.name}: ${distance}`
          );

          if (
            distance <
            bestDistance
          ) {

            bestDistance =
              distance;

            bestMatch =
              student;
          }
        }
      );

      // ========================================
      // Show comparison result
      // ========================================

      console.log(
        "================================"
      );

      console.log(
        "BEST MATCH:",
        bestMatch?.name
      );

      console.log(
        "BEST DISTANCE:",
        bestDistance
      );

      console.log(
        "================================"
      );

      // ========================================
      // Recognition threshold
      // ========================================

      const MATCH_THRESHOLD =
        0.48;

      // ========================================
      // Reject unknown face
      // ========================================

      if (
        !bestMatch ||
        bestDistance >
          MATCH_THRESHOLD
      ) {

        setMessage(
          "❌ Face not recognized."
        );

        alert(
          "Face not recognized. Attendance was NOT marked."
        );

        return;
      }

      // ========================================
      // Recognized
      // ========================================

      setMessage(
        `Recognized: ${bestMatch.name}`
      );

      console.log(
        "Recognized:",
        bestMatch.name
      );

      console.log(
        "Distance:",
        bestDistance
      );

      // ========================================
      // Mark attendance
      // ========================================

      const response =
        await API.post(
          "/attendance/face",
          {
            student:
              bestMatch._id,
          }
        );

      // ========================================
      // Success
      // ========================================

      alert(
        `${bestMatch.name} - Attendance marked successfully`
      );

      setMessage(
        `✅ ${bestMatch.name} marked Present`
      );

      console.log(
        "SERVER RESPONSE:",
        response.data
      );

    } catch (error) {

      console.error(
        "FACE ATTENDANCE ERROR:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Face attendance failed";

      alert(
        errorMessage
      );

      setMessage(
        errorMessage
      );

    } finally {

      setProcessing(false);

    }
  };

  // ==========================================
  // Webcam settings
  // ==========================================

  const videoConstraints = {
    facingMode: facingMode,
    width: 500,
    height: 500,
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-900 min-h-screen p-4 sm:p-8 text-white">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-400">
          Face Recognition Attendance
        </h1>

        <div className="bg-slate-800 p-4 sm:p-8 rounded-xl shadow max-w-3xl">

          {/* ================================= */}
          {/* Camera */}
          {/* ================================= */}

          <div className="flex justify-center">

            <div className="relative">

              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={
                  videoConstraints
                }
                width={500}
                className="rounded-xl w-full max-w-[500px]"
              />

              {/* ================================= */}
              {/* Camera Switch Symbol */}
              {/* ================================= */}

              <button
                type="button"
                onClick={switchCamera}
                disabled={processing}
                aria-label="Switch camera"
                className="absolute top-3 right-3 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white text-2xl transition-all active:scale-90 disabled:opacity-50"
              >
                🔄
              </button>

            </div>

          </div>

          {/* ================================= */}
          {/* Camera Status */}
          {/* ================================= */}

          <p className="text-center text-gray-400 text-sm mt-3">

            {facingMode === "user"
              ? "Front Camera"
              : "Back Camera"}

          </p>

          {/* ================================= */}
          {/* Status */}
          {/* ================================= */}

          <div className="text-center mt-6">

            <p className="text-gray-300 mb-5">
              {message}
            </p>

            {/* ================================= */}
            {/* Capture Button */}
            {/* ================================= */}

            <button
              onClick={capture}
              disabled={
                !modelsLoaded ||
                processing
              }
              className={`px-8 py-3 rounded text-white ${
                !modelsLoaded ||
                processing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >

              {processing
                ? "Recognizing..."
                : "Capture & Mark Attendance"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default FaceAttendance;
