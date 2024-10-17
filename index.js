import express from "express";
import multer from "multer";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { encrypt, decrypt } from "./crypto.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure uploads folder exists with error handling
const uploadsDir = path.resolve(__dirname, "uploads"); // Absolute path to uploads folder
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Uploads folder created at: ${uploadsDir}`);
    }
} catch (error) {
    console.error("Error creating uploads folder:", error);
    process.exit(1); // Exit if folder creation fails
}

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("view engines", "js");
app.set("views", path.join(__dirname, "views"));



// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Save files in the uploads folder
    },
    filename: function (req, file, cb) {
       
        const filename = file.originalname;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

// Render the upload form
app.get("/", (req, res) => {
    res.render("index");
});

// Handle file upload and save metadata to data.json
app.post("/upload", upload.single("file"), (req, res, next) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "Please upload a file" });
        }

        const absolutePath = path.resolve(file.path);
        const fileData = {
            filename: file.filename,
            path: absolutePath,
        };

        const dataFilePath = path.resolve(__dirname, "data.json");
        let existingData = [];

        // Read existing data.json if it exists
        if (fs.existsSync(dataFilePath)) {
            const rawData = fs.readFileSync(dataFilePath, "utf8");
            existingData = JSON.parse(rawData || "[]"); // Handle empty JSON file case
        }

        // Append new file data
        existingData.push(fileData);

        // Write updated data to data.json
        fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

        res.status(200).json({
            message: "File uploaded and path saved successfully",
            file: fileData,
        });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/data", (req, res) => {
    try {
        const dataFilePath = path.resolve(__dirname, "data.json");
        const rawData = fs.readFileSync(dataFilePath, "utf8");
        const data = JSON.parse(rawData || "[]"); // Handle empty JSON file case
        res.status(200).json(data);
    } catch (error) {
        console.error("Error reading data.json:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
// File download route
app.post("/getFile", (req, res) => {
    try {
        const { filename } = req.query;

        if (!filename) {
            return res.status(400).json({ error: "Filename is required." });
        }

        // Resolve the uploads directory and file path
        const uploadsDir = path.resolve(__dirname, "uploads");
        const absolutePath = path.join(uploadsDir, filename);

        // Check if the file exists
        fs.access(absolutePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error("File not found at path:", absolutePath); // Log if file isn't found
                return res.status(404).json({ error: "File not found." });
            }

            const fileBuffer = fs.readFileSync(absolutePath);
            const base64Data = fileBuffer.toString("base64");
            // console.log(" Base64 data:",base64Data);
            // console.log("filbuffer:",fileBuffer);

    
            // Send the Base64 data as a JSON response
          const data =  encrypt(base64Data, 'shivam');
        //   console.log("data",data);
            res.status(200).json({
                filename,
                data: data,
            });
        });
    } catch (error) {
        console.error("Error retrieving the file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/crypto", (req, res) => {
    res.render("crypto.js");
})

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
