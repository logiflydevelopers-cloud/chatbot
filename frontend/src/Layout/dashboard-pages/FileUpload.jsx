import React, { useState, useEffect } from "react";
import "./FileUpload.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./train-page.css";

const FileUpload = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // 🔹 NEW
    const [showPopup, setShowPopup] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);

    // Load userId
    let userId = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed?._id || parsed?.id || parsed?.userId;
        }
    } catch { }

    /* ================= LOAD PDF STATUS FROM DB ================= */
    useEffect(() => {
        if (!userId) return;

        axios
            .get(`http://localhost:4000/api/pdf/status/${userId}`)
            .then((res) => {
                if (res.data?.hasPdf) {
                    setFile({ name: res.data.pdfName }); // only name show
                    setUploadDone(true);                // 🔒 permanently lock
                }
            })
            .catch(() => { });
    }, [userId]);

    /* ================= FILE SELECT (NO AUTO UPLOAD) ================= */
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (selected.type !== "application/pdf") {
            setError("Only PDF files allowed");
            return;
        }

        setError("");
        setSuccess("");
        setFile(selected); // only set file
    };

    /* ================= CANCEL FILE ================= */
    const handleCancel = () => {
        setFile(null);
        setError("");
    };

    /* ================= UPLOAD ================= */
    const handleUpload = async () => {
        if (!file || uploadDone || !(file instanceof File)) return;

        if (!userId) {
            setError("User ID missing!");
            return;
        }

        setShowPopup(true);
        setIsUploading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("userId", userId);

        try {
            await axios.post(
                "http://localhost:4000/api/pdf/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // ⏳ 2 sec loader
            setTimeout(() => {
                setIsUploading(false);
                setSuccess("PDF uploaded successfully!");
                setUploadDone(true);
            }, 2000);

        } catch (err) {
            setIsUploading(false);
            setShowPopup(false);
            setError(
                err?.response?.data?.message ||
                "Upload failed. Try again."
            );
        }
    };

    return (
        <div className="persona-container">
            <div className="fu-header persona-header">
                <button
                    className="fu-back-btn"
                    onClick={() => navigate("/dashboard/knowledge")}
                >
                    ←
                </button>

                <div>
                    <h2>FILE</h2>
                    <p>Upload files to train your Agent</p>
                </div>
            </div>

            <div className="fu-card">

                {/* Upload box only when no file & not uploaded before */}
                {!file && !uploadDone && (
                    <div className="fu-upload-box">
                        <AiOutlineCloudUpload className="fu-upload-icon" />
                        <p className="fu-upload-text">
                            Drag and drop your files here or{" "}
                            <span className="fu-upload-link">upload files</span>
                        </p>

                        <input
                            type="file"
                            accept="application/pdf"
                            className="fu-input"
                            onChange={handleFileChange}
                        />
                    </div>
                )}

                {error && <p className="fu-error">{error}</p>}

                {/* Selected file row */}
                {file && (
                    <div className="fu-file-row">
                        <p className="fu-success">Selected: {file.name}</p>

                        {/* Cancel only if not uploaded */}
                        {!uploadDone && (
                            <button
                                className="fu-cancel-btn"
                                onClick={handleCancel}
                            >
                                ✖
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Button */}
            <button
                className={`fu-save-btn ${uploadDone ? "blur" : ""}`}
                onClick={handleUpload}
                disabled={isUploading || uploadDone || !file}
            >
                {isUploading ? "Uploading..." : "Upload"}
            </button>

            {/* ================= POPUP ================= */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        {isUploading ? (
                            <>
                                <div className="loader"></div>
                                <p>Uploading...</p>
                            </>
                        ) : (
                            <>
                                <p>{success}</p>
                                <button className="popup-box-btn" onClick={() => setShowPopup(false)}>
                                    OK
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
