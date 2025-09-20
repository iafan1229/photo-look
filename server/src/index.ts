//이 프로젝트에는 실제 사용되는 api가 5개 있음.

require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
const { connectDB } = require("./utils/mongodb");

// Router 파일들 import
const mainRoutes = require("./routes/mainRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// MongoDB 연결
const connectToMongoDB = async () => {
  try {
    await connectDB();
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

connectToMongoDB();

// 미들웨어 설정
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// Router 패턴 - 라우트를 모듈별로 분리
app.use("/api/main", mainRoutes);
app.use("/api/verification", adminRoutes);

// 기본 라우트들
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy" });
});

// 404 에러 핸들링
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// 전역 에러 핸들링
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Health check endpoint: http://${HOST}:${PORT}/api/health`);
});

export default app;
