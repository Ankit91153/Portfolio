import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Modal } from "react-bootstrap";
import {
  FaFileUpload,
  FaCamera,
  FaFilePdf,
  FaCopy,
  FaCheck,
  FaDownload,
  FaTrashAlt,
  FaMagic,
  FaMobileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCode,
  FaSyncAlt,
  FaArrowLeft,
  FaVideo,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  extractTextFromPdf,
  extractTextFromImage,
  extractWithGroq,
  tryServerApiExtraction,
  parseResumeTextHeuristic,
  validateForResumeKit,
  SAMPLE_EXPO_RESUME,
  cleanAndParseJson,
} from "./resumeParserEngine";
import "./Services.css";

export default function ResumeScanner() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressVal, setProgressVal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Live Camera Viewfinder State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const nativeCameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Resume JSON State
  const [resumeData, setResumeData] = useState(SAMPLE_EXPO_RESUME);
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(SAMPLE_EXPO_RESUME, null, 2)
  );
  const [jsonParseError, setJsonParseError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Read Groq API Key from .env or localStorage
  const groqApiKey =
    process.env.REACT_APP_GROQ_API_KEY ||
    process.env.GROQ_API_KEY ||
    (typeof window !== "undefined" && localStorage.getItem("resumekit_groq_key")) ||
    "";

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Start live webcam / mobile camera stream
  const startCamera = async (facing = cameraFacing) => {
    setIsCameraOpen(true);
    setErrorMessage("");
    try {
      stopCameraStream();
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Could not start live webcam, falling back to native file capture:", err);
      setIsCameraOpen(false);
      if (nativeCameraInputRef.current) {
        nativeCameraInputRef.current.click();
      } else {
        setErrorMessage(
          "Camera access was denied or device has no camera. Please use File Upload instead."
        );
      }
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const capturePhotoFromStream = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const photoFile = new File([blob], `resume-camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        stopCameraStream();
        setIsCameraOpen(false);
        handleFile(photoFile);
      },
      "image/jpeg",
      0.95
    );
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    setErrorMessage("");
    setFile(selectedFile);

    const isPdf =
      selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf");
    const isImage = selectedFile.type.startsWith("image/");

    if (!isPdf && !isImage) {
      setErrorMessage(
        "Please select a PDF document (.pdf) or an Image (.png, .jpg, .jpeg, .webp)."
      );
      return;
    }

    setFileType(isPdf ? "pdf" : "image");

    if (isImage) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }

    await runExtraction(selectedFile, isPdf ? "pdf" : "image");
  };

  const runExtraction = async (targetFile, type) => {
    setIsProcessing(true);
    setProgressVal(0.2);
    setProgressMsg("Starting resume extraction...");

    try {
      // 1. Try Vercel Serverless API first (secure server-side with GROQ_API_KEY)
      setProgressMsg("Analyzing resume with Groq AI...");
      setProgressVal(0.4);

      let rawPdfText = "";
      if (type === "pdf") {
        rawPdfText = await extractTextFromPdf(targetFile, (p) => {
          setProgressVal(0.1 + p.progress * 0.25);
          setProgressMsg("Reading PDF text stream...");
        });
      }

      const serverResult = await tryServerApiExtraction({
        file: targetFile,
        rawText: rawPdfText,
        mimeType: targetFile.type,
        provider: "groq",
      });

      if (serverResult) {
        updateData(serverResult);
        setProgressVal(1.0);
        setProgressMsg("Extracted successfully with Groq AI!");
        setIsProcessing(false);
        return;
      }

      // 2. Try direct client-side Groq API call if groqApiKey is present in .env
      if (groqApiKey && groqApiKey.trim()) {
        try {
          setProgressMsg("Extracting details with Groq AI...");
          const clientAiResult = await extractWithGroq(groqApiKey.trim(), {
            file: targetFile,
            rawText: rawPdfText,
            mimeType: targetFile.type,
          });

          if (clientAiResult) {
            updateData(clientAiResult);
            setProgressVal(1.0);
            setProgressMsg("Extracted successfully with Groq AI!");
            setIsProcessing(false);
            return;
          }
        } catch (aiErr) {
          console.warn("Groq AI extraction failed, falling back to local engine:", aiErr);
          setProgressMsg("AI parsing unavailable, using local extraction...");
        }
      }

      // 3. In-Browser OCR / Heuristic Fallback (zero key required)
      let extractedText = rawPdfText;
      if (type !== "pdf") {
        setProgressMsg("Scanning image with in-browser OCR (Tesseract)...");
        extractedText = await extractTextFromImage(targetFile, (p) => {
          setProgressVal(p.progress);
          setProgressMsg(p.message);
        });
      }

      setProgressMsg("Formatting into ResumeKit format...");
      setProgressVal(0.9);

      const structured = parseResumeTextHeuristic(extractedText);
      updateData(structured);

      setProgressVal(1.0);
      setProgressMsg("Complete! Generated ResumeKit JSON below.");
    } catch (err) {
      console.error("Extraction error:", err);
      setErrorMessage(
        `Notice: ${err.message || "Failed to extract"}. You can still edit the JSON directly below.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const updateData = (newData) => {
    setResumeData(newData);
    setJsonText(JSON.stringify(newData, null, 2));
    setJsonParseError("");
  };

  const handleJsonChange = (e) => {
    const text = e.target.value;
    setJsonText(text);
    try {
      const parsed = cleanAndParseJson(text);
      if (parsed) {
        setResumeData(parsed);
        setJsonParseError("");
      }
    } catch (err) {
      setJsonParseError("Invalid JSON syntax: " + err.message);
    }
  };

  const handlePrettifyJson = () => {
    try {
      const parsed = cleanAndParseJson(jsonText);
      if (parsed) {
        updateData(parsed);
      }
    } catch (err) {
      setJsonParseError("Cannot format: " + err.message);
    }
  };

  const handleLoadSample = () => {
    updateData(SAMPLE_EXPO_RESUME);
    setErrorMessage("");
  };

  const handleReset = () => {
    setFile(null);
    setFilePreview(null);
    setErrorMessage("");
    setProgressMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = jsonText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(jsonText);
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    const candidateName =
      (resumeData.personalInfo?.fullName || "candidate")
        .toLowerCase()
        .replace(/\s+/g, "-");
    dlAnchor.setAttribute("download", `resumekit-${candidateName}.json`);
    dlAnchor.click();
  };

  const validation = validateForResumeKit(resumeData);

  return (
    <div className="scanner-tool-card">
      {/* Top Header Row */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <Link
          to="/services"
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
          style={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.2)" }}
        >
          <FaArrowLeft /> Back to Services
        </Link>
        <span className="scanner-live-badge">ResumeKit Mobile Compatible</span>
      </div>

      {/* Copied Toast Banner */}
      {copied && (
        <div className="copied-toast-banner">
          <FaCheckCircle size={22} />
          <div>
            <strong style={{ display: "block" }}>Copied to Clipboard!</strong>
            <small>Ready to paste in ResumeKit Mobile App (Clone CV)</small>
          </div>
        </div>
      )}

      {/* Main Title */}
      <div className="text-center mb-4">
        <h2 className="scanner-main-heading justify-content-center">
          <FaCode style={{ color: "#c770f0" }} />
          <span>AI Resume Parser & Exporter</span>
        </h2>
        <p style={{ color: "#94a3b8", maxWidth: "680px", margin: "8px auto 0 auto", fontSize: "0.95rem" }}>
          Upload your resume file or snap a picture with camera. The AI extracts candidate details into the exact ResumeKit mobile format.
        </p>
      </div>

      {/* ========================================================
          TWO PRIMARY ACTION BUTTONS: [ UPLOAD FILE ] & [ CAMERA ]
         ======================================================== */}
      <Row className="g-3 mb-4">
        {/* OPTION 1: UPLOAD FILE */}
        <Col md={6}>
          <div
            className={`scanner-dropzone h-100 ${isDragging ? "dragging" : ""}`}
            style={{ padding: "30px 20px" }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <div className="dropzone-icon" style={{ fontSize: 36, marginBottom: 8 }}>
              <FaFileUpload />
            </div>
            <h5 className="dropzone-title" style={{ fontSize: "1.15rem" }}>
              Upload Resume (PDF or Picture)
            </h5>
            <p className="dropzone-sub" style={{ fontSize: "0.85rem", marginBottom: 12 }}>
              Drag & drop document or browse from device
            </p>
            <button type="button" className="dropzone-btn" style={{ fontSize: "0.85rem" }}>
              Select File
            </button>
          </div>
        </Col>

        {/* OPTION 2: CAMERA CAPTURE */}
        <Col md={6}>
          <div
            className="scanner-dropzone h-100"
            style={{
              padding: "30px 20px",
              borderColor: "rgba(56, 189, 248, 0.45)",
              background: "rgba(14, 25, 48, 0.45)",
            }}
            onClick={() => startCamera()}
          >
            <input
              type="file"
              ref={nativeCameraInputRef}
              style={{ display: "none" }}
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <div className="dropzone-icon" style={{ fontSize: 36, marginBottom: 8, color: "#38bdf8" }}>
              <FaCamera />
            </div>
            <h5 className="dropzone-title" style={{ fontSize: "1.15rem" }}>
              Take Photo with Camera
            </h5>
            <p className="dropzone-sub" style={{ fontSize: "0.85rem", marginBottom: 12 }}>
              Capture resume paper directly via webcam or mobile camera
            </p>
            <button
              type="button"
              className="dropzone-btn"
              style={{
                fontSize: "0.85rem",
                borderColor: "#38bdf8",
                background: "rgba(56, 189, 248, 0.2)",
              }}
            >
              Open Camera
            </button>
          </div>
        </Col>
      </Row>

      {/* Helper Bar */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <button
          type="button"
          className="btn-sample-load"
          onClick={handleLoadSample}
          title="Load pre-filled sample resume"
        >
          <FaMagic /> Load Sample Demo
        </button>

        {file && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={handleReset}
          >
            <FaTrashAlt /> Clear Uploaded File
          </button>
        )}
      </div>

      {/* Selected File Banner */}
      {file && (
        <div className="file-selected-banner mb-3">
          <div className="file-info-group">
            {fileType === "image" && filePreview ? (
              <img src={filePreview} alt="Preview" className="file-thumb-preview" />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                <FaFilePdf />
              </div>
            )}
            <div className="file-details">
              <h5>{file.name}</h5>
              <p>
                {(file.size / 1024).toFixed(1)} KB • {file.type || "Document"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => runExtraction(file, fileType)}
            disabled={isProcessing}
          >
            <FaSyncAlt /> Re-extract
          </button>
        </div>
      )}

      {/* Progress Loader */}
      {isProcessing && (
        <div className="parsing-loader-wrap mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong style={{ color: "#c770f0", fontSize: "0.95rem" }}>
              {progressMsg || "Processing resume..."}
            </strong>
            <span style={{ color: "#38bdf8", fontWeight: "bold" }}>
              {Math.round(progressVal * 100)}%
            </span>
          </div>
          <div className="parsing-progress-bar-container">
            <div
              className="parsing-progress-bar-fill"
              style={{ width: `${Math.round(progressVal * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="alert alert-warning mb-4" role="alert" style={{ fontSize: "0.9rem" }}>
          <FaExclamationTriangle className="me-2" />
          {errorMessage}
        </div>
      )}

      {/* ========================================================
          EDITABLE JSON SECTION WITH COPY BUTTON DIRECTLY BELOW
         ======================================================== */}
      <div className="editor-main-card mt-3">
        <div className="editor-header-nav">
          <div>
            <h4 style={{ margin: 0, color: "#ffffff", fontWeight: 700, fontSize: "1.25rem" }}>
              Generated ResumeKit JSON (Editable)
            </h4>
            <small style={{ color: "#94a3b8" }}>
              Directly edit any field below. Click Copy to paste into ResumeKit mobile app.
            </small>
          </div>

          <div className="editor-cta-group">
            <button
              type="button"
              className={`btn-copy-mobile ${copied ? "copied" : ""}`}
              onClick={handleCopyJson}
            >
              {copied ? <FaCheck /> : <FaCopy />}
              <span>{copied ? "Copied to Clipboard! ✓" : "Copy JSON for Mobile App"}</span>
            </button>

            <button
              type="button"
              className="btn-download-json"
              onClick={handleDownloadJson}
              title="Download JSON File"
            >
              <FaDownload /> Download .json
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light"
              onClick={handlePrettifyJson}
              title="Format JSON"
            >
              Format JSON
            </button>
          </div>
        </div>

        {/* Validation Pill */}
        <div className="validation-status-pill">
          {validation.valid ? (
            <>
              <FaCheckCircle color="#10b981" />
              <span>
                <strong>Ready for ResumeKit:</strong> Candidate{" "}
                <strong>"{validation.stats.candidateName}"</strong> ({validation.stats.jobTitle}) •{" "}
                {validation.stats.skillsCount} Skills • {validation.stats.expCount} Experience •{" "}
                {validation.stats.eduCount} Education
              </span>
            </>
          ) : (
            <>
              <FaExclamationTriangle color="#f59e0b" />
              <span>{validation.error}</span>
            </>
          )}
        </div>

        {jsonParseError && (
          <div className="alert alert-danger mb-2 p-2" style={{ fontSize: "0.85rem" }}>
            {jsonParseError}
          </div>
        )}

        {/* Editable JSON Textarea */}
        <div className="json-editor-wrap">
          <textarea
            className="json-textarea-field"
            value={jsonText}
            onChange={handleJsonChange}
            spellCheck={false}
            placeholder="JSON output will appear here..."
          />
        </div>
      </div>

      {/* Mobile App Paste Instructions */}
      <div className="mobile-tutorial-card mt-4">
        <div className="tutorial-title">
          <FaMobileAlt color="#38bdf8" />
          <span>How to Import into ResumeKit Mobile App</span>
        </div>
        <div className="tutorial-grid">
          <div className="tutorial-step-card">
            <span className="tutorial-step-badge">1</span>
            <div className="tutorial-step-name">Copy JSON</div>
            <p className="tutorial-step-text">
              Click the green <strong>"Copy JSON for Mobile App"</strong> button above.
            </p>
          </div>
          <div className="tutorial-step-card">
            <span className="tutorial-step-badge">2</span>
            <div className="tutorial-step-name">Open Mobile App</div>
            <p className="tutorial-step-text">
              Open the <strong>ResumeKit</strong> app on your Android or iOS phone.
            </p>
          </div>
          <div className="tutorial-step-card">
            <span className="tutorial-step-badge">3</span>
            <div className="tutorial-step-name">Tap "Clone CV"</div>
            <p className="tutorial-step-text">
              On the Home Screen, tap <strong>"Clone CV"</strong> (top header or empty card).
            </p>
          </div>
          <div className="tutorial-step-card">
            <span className="tutorial-step-badge">4</span>
            <div className="tutorial-step-name">Paste & Create</div>
            <p className="tutorial-step-text">
              Tap <strong>"Paste Clipboard"</strong> and press <strong>"Create Profile"</strong>. Your entire resume profile is ready!
            </p>
          </div>
        </div>
      </div>

      {/* Live Camera Modal */}
      <Modal
        show={isCameraOpen}
        onHide={() => {
          stopCameraStream();
          setIsCameraOpen(false);
        }}
        size="lg"
        centered
        contentClassName="bg-dark text-light border border-secondary"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 10 }}>
            <FaVideo style={{ color: "#38bdf8" }} /> Take Photo of Resume
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-3">
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "640px",
              margin: "0 auto",
              borderRadius: "14px",
              overflow: "hidden",
              background: "#000000",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "440px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "12px",
                bottom: "12px",
                left: "12px",
                right: "12px",
                border: "2px dashed rgba(56, 189, 248, 0.7)",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: 12, marginBottom: 0 }}>
            Align your resume page inside the frame and snap photo.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary text-light btn-sm"
            onClick={toggleCameraFacing}
          >
            <FaSyncAlt /> Flip Camera
          </button>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                stopCameraStream();
                setIsCameraOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-info fw-bold d-inline-flex align-items-center gap-2"
              onClick={capturePhotoFromStream}
              style={{ background: "#38bdf8", border: "none", color: "#0c0513" }}
            >
              <FaCamera /> Snap Photo & Extract
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
