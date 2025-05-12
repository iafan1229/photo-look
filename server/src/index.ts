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

// Body parser middleware
app.use(bodyParser.json({ limit: "50mb" })); // 이미지 업로드를 위해 용량 제한 증가
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// Auth routes
app.post("/api/auth/register", authController.register);

// Main routes
app.get("/api/main/list", mainController.list);
app.get("/api/main/list-slider", mainController.slider);

// Verification routes (새로 추가된 부분)
app.post(
  "/api/upload-to-s3-and-notify",
  verificationController.uploadToS3AndNotify
);
app.post("/api/verification/approve", verificationController.approveMagazine);
app.post("/api/verification/reject", verificationController.rejectMagazine);

// 사용자 데이터 조회 라우트
app.get("/api/verification/details", verificationController.getUserDetails);

app.get("/api/verification/reject", (_: Request, res: Response) => {
  // GET 요청으로 거절 페이지에 접근했을 때 거절 사유를 입력할 수 있는 폼 제공
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // return res.send(rejectForm);
  // return res.status(200).send(rejectForm);
});

// 상태 확인 엔드포인트
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost"; // 모든 네트워크 인터페이스에 바인딩

app.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Health check endpoint: http://${HOST}:${PORT}/api/health`);
});
