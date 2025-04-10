require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const { connectDB } = require("./utils/db");
const app = express();
const authController = require("./controllers/authController");
const mainController = require("./controllers/mainController");

const connectToMongoDB = async () => {
  try {
    await connectDB(); // DB 연결
    // const db = client.db(); // DB 인스턴스를 얻는다
    console.log("MongoDB connection successful");
    // 이 후 db 작업을 진행할 수 있습니다.
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

connectToMongoDB();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Auth routes
app.use("/api/auth/register", authController.register);
app.use("/api/main/list", mainController.list);
app.use("/api/main/list-slider", mainController.slider);

const PORT = 8080;
const HOST = "0.0.0.0"; // 모든 네트워크 인터페이스에 바인딩
app.listen(PORT, HOST, () =>
  console.log(`Server is running on ${HOST}:${PORT}`)
);
// Express.js 서버인 경우
app.get("/api/health", (req, res) => {
  // 필요에 따라 DB 연결 등 추가 확인 가능
  res.status(200).json({ status: "healthy" });
});
