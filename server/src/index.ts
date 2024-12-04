require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const { connectDB: DB } = require("./utils/db");

const app = express();

const authRoutes = require("./routes/auth");

DB.then((client: any) => {
  const db = client.db("photo-look");
  // 데이터베이스 작업 수행
  console.log(db, "Connected to MongoDB");
}).catch((error: Error) => {
  console.error("Failed to connect to MongoDB", error);
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Auth routes
app.use("/api/auth", authRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
