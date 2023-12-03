import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import { createReadStream } from "fs";

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});
const PORT = 8000;
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    console.log("file ", file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");
let filePath;

app.use(cors());
app.use(express.json());

app.post("/images", async (req, res) => {
  try {
    const imageResponse = await openai.images.generate({
      prompt: req.body.message,
      n: 5,
      size: "1024x1024",
    });

    console.log(imageResponse);
    res.send(imageResponse);
  } catch (err) {
    console.error(err);
  }
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file.path);
    filePath = req.file.path;
  });
});

app.post("/variations", async (req, res) => {
  try {
    const response = await openai.images.createVariation({
      image: createReadStream(filePath),
      n: 5,
      size: "1024x1024",
    });
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => console.log("Your server is running on PORT " + PORT));
