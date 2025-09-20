// server/src/index.ts
require("dotenv").config();
import express, { Request, Response, RequestHandler } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { rejectForm } from "./utils/htmlString";
const { connectDB } = require("./utils/db");
const app = express();
const authController = require("./controllers/authController");
const mainController = require("./controllers/mainController");
const verificationController = require("./controllers/verificationController");

const connectToMongoDB = async () => {
  try {
    await connectDB(); // DB 연결
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

connectToMongoDB();

app.use(bodyParser.json({ limit: "50mb" })); // 이미지 업로드를 위해 용량 제한 증가
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// 리스트
app.get("/api/main/list", mainController.list);

// 이미지를 s3에 저장
app.post(
  "/api/upload-to-s3-and-notify",
  verificationController.uploadToS3AndNotify
);

// admin - 사용자 이미지 조회
app.get("/api/verification/details", verificationController.getUserDetails);

// admin - 이미지 업로드 승인 & 거절
app.post("/api/verification/approve", verificationController.approveMagazine);
app.post("/api/verification/reject", verificationController.rejectMagazine);

// 상태 확인 엔드포인트
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Health check endpoint: http://${HOST}:${PORT}/api/health`);
});
