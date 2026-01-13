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
                    setFile({ name: res.data.pdfName });
                }
            })
            .catch(() => { });
    }, [userId]);

    /* ================= FILE SELECT ================= */
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (selected.type !== "application/pdf") {
            setError("Only PDF files allowed");
            return;
        }

        setError("");
        setSuccess("");
        setFile(selected);
    };

    /* ================= UPLOAD ================= */
    const handleUpload = async () => {
        if (!file || !(file instanceof File)) {
            return;
        }


        if (!userId) {
            setError("User ID missing!");
            return;
        }

        setIsUploading(true);
        setError("");
        setSuccess("Processing started…");

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("userId", userId);

        try {
            await axios.post(
                "http://localhost:4000/api/pdf/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 5000
                }
            );

            setSuccess("PDF uploaded successfully! Training started.");
            setError("");

        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Upload failed. Try again."
            );
            setSuccess("");
        } finally {
            setIsUploading(false);
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

                {/* 🔒 Upload box hide when PDF exists */}
                {!file && (
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

                {file && (
                    <div className="fu-file-row">
                        <p className="fu-success">Selected: {file.name}</p>
                    </div>
                )}

                {success && <p className="fu-success-msg">{success}</p>}
            </div>

            <button
                className="fu-save-btn"
                onClick={handleUpload}
                disabled={isUploading || !!file}   // 🔒 LOCK BUTTON
            >
                {isUploading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
};

export default FileUpload;
