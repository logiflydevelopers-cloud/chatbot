import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FileUpload.css";
import { useNavigate } from "react-router-dom";


const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [dbFile, setDbFile] = useState(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // ===== LOAD USER ID =====
    let userId = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed?._id || parsed?.id || parsed?.userId;
        }
    } catch { }

    // ===== LOAD DATABASE FILE FROM LOCALSTORAGE =====
    useEffect(() => {
        const saved = localStorage.getItem("uploadedFileData");
        if (saved) {
            setDbFile(JSON.parse(saved));
        }
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected || selected.type !== "application/pdf") {
            return setError("Only PDF allowed!");
        }
        setFile(selected);
        setError("");
    };

    const navigate = useNavigate();


    const handleUpload = async () => {
        if (!file) return setError("Please select a PDF");
        if (!userId) return setError("UserId missing!");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        try {
            const res = await axios.post(
                "https://backend-demo-chatbot.vercel.app/file/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setDbFile(res.data.file);
            localStorage.setItem("uploadedFileData", JSON.stringify(res.data.file));

            setSuccess("Upload successful!");
            setError("");
            setFile(null);

        } catch (err) {
            setError("Upload failed");
        }
    };

    const removeFile = async () => {
        try {
            if (dbFile?._id) {
                await axios.delete(`https://backend-demo-chatbot.vercel.app/file/delete/${dbFile._id}`);
            }

            setDbFile(null);
            localStorage.removeItem("uploadedFileData");

            setSuccess("File removed!");
            setError("");

        } catch (err) {
            setError("Delete failed");
        }
    };

    return (
        <div className="fu-wrapper">

            <div className="fu-header">
                <button
                    className="fu-back-btn"
                    onClick={() => navigate("/dashboard/knowledge")}
                >
                    ←
                </button>

                <div>
                    <h2 className="fu-title">FILE</h2>
                    <p className="fu-subtitle">Upload files to train your Agent</p>
                </div>
            </div>

            <div className="fu-card">
                <label className="fu-label">Upload Files</label>

                {!dbFile && (
                    <div className="fu-upload-box">
                        <div className="fu-upload-icon">📄</div>
                        <p className="fu-upload-text">
                            Drag & drop your PDF or <span className="fu-upload-link">Upload</span>
                        </p>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="fu-input"
                            onChange={handleFileChange}
                        />
                    </div>
                )}

                {file && !dbFile && (
                    <div style={{ marginTop: "12px" }}>
                        <b>Selected:</b> {file.name}
                    </div>
                )}

                {dbFile && (
                    <div style={{ marginTop: "12px" }}>
                        <b>Uploaded File:</b> {dbFile.fileName}
                        <button className="fu-remove-btn" onClick={removeFile}>Remove</button>
                    </div>
                )}

                {error && <p className="fu-error">{error}</p>}
                {success && <p className="fu-success">{success}</p>}
            </div>

            {!dbFile && (
                <button className="fu-save-btn" onClick={handleUpload}>
                    Upload
                </button>
            )}

        </div>
    );
};

export default FileUpload;
