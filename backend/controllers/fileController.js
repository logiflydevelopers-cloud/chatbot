import File from "../models/File.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

// =============== UPLOAD FILE ===============
export const uploadFile = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });

        const { userId } = req.body;

        if (!userId || userId === "undefined") {
            return res.status(400).json({ message: "UserId missing!" });
        }

        // 1️⃣ SAVE IN DATABASE
        const savedFile = await File.create({
            userId,
            fileName: req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`,
            fileType: req.file.mimetype,
        });

        // 2️⃣ SEND TO N8N WORKFLOW (Error ignored)
        try {
            const form = new FormData();
            form.append("userId", userId);
            form.append("pdf", fs.createReadStream(req.file.path));

            axios.post("http://localhost:5678/webhook-test/pdf-upload",
                form,
                { headers: form.getHeaders() }
            );
        } catch (e) {
            console.log("⚠ N8N failed:", e.message);
        }

        return res.json({
            success: true,
            message: "File uploaded successfully",
            file: savedFile
        });

    } catch (err) {
        console.log("❌ UPLOAD ERROR:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// =============== DELETE FILE ===============
export const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const fileData = await File.findById(fileId);
        if (!fileData)
            return res.status(404).json({ message: "File not found" });

        const filePath = `uploads/${fileData.fileUrl.replace("/uploads/", "")}`;

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await File.findByIdAndDelete(fileId);

        return res.json({ success: true, message: "File deleted" });

    } catch (err) {
        console.log("❌ DELETE ERROR:", err);
        res.status(500).json({ message: "Delete failed" });
    }
};
