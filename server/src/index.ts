require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const { connectDB } = require("./utils/db");
const app = express();
const authController = require("./controllers/authController");

const connectToMongoDB = async () => {
  try {
    const client = await connectDB(); // DB 연결
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

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
