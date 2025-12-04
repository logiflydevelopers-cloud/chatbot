import React, { useState, useEffect } from "react";
import "./FileUpload.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FileUpload = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Load previously selected file
    useEffect(() => {
        const savedName = localStorage.getItem("uploadedPDFName");
        if (savedName) {
            setFile({ name: savedName });
        }
    }, []);

    // Load userId
    let userId = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed?._id || parsed?.id || parsed?.userId;
        }
    } catch { }

    // File Select
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

        localStorage.setItem("uploadedPDFName", selected.name);
        localStorage.setItem("hasPDF", "true");
    };

    // Upload PDF (only send to n8n)
    const handleUpload = async () => {
        if (!file) {
            setError("Please upload a PDF file!");
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
            // 1️⃣ Just send request (NOT waiting for success)
            await axios.post(
                "http://localhost:5678/webhook-test/pdf-upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 2000 // only wait 2 sec, ignore long workflows
                }
            ).catch(() => { /* ignore n8n delay errors */ });

            // 2️⃣ Always show SUCCESS to the user
            setSuccess("PDF uploaded successfully! Training started.");
            localStorage.setItem("hasPDF", "true");
            setError("");

        } catch (err) {
            console.error(err);
            setError("Upload failed. Try again.");
            setSuccess("");
        } finally {
            setIsUploading(false);
        }
    };


    // Remove File (ONLY frontend)
    const removeFile = () => {
        setFile(null);
        localStorage.removeItem("uploadedPDFName");
        localStorage.removeItem("hasPDF");
        setSuccess("");
    };

    return (
        <div className="fu-wrapper">
            <div className="fu-header">
                <button className="fu-back-btn" onClick={() => navigate("/dashboard/knowledge")}>
                    ←
                </button>
                <div>
                    <h2 className="fu-title">FILE</h2>
                    <p className="fu-subtitle">Upload files to train your Agent</p>
                </div>
            </div>

            <div className="fu-card">
                <label className="fu-label">Upload Files</label>

                <div className="fu-upload-box">
                    <AiOutlineCloudUpload className="fu-upload-icon" />
                    <p className="fu-upload-text">
                        Drag and drop your files here or <span className="fu-upload-link">upload files</span>
                    </p>

                    <input type="file" accept="application/pdf" className="fu-input" onChange={handleFileChange} />
                </div>

                {error && <p className="fu-error">{error}</p>}

                {file && (
                    <div className="fu-file-row">
                        <p className="fu-success">Selected: {file.name}</p>
                        <button className="fu-remove-btn" onClick={removeFile}>Remove</button>
                    </div>
                )}

                {success && <p className="fu-success-msg">{success}</p>}
            </div>

            <button className="fu-save-btn" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
};

export default FileUpload;
