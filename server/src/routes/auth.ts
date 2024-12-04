import express from "express";
const router = express.Router();
const authController = require("../controllers/authController");

// 로그인 라우트
router.post("/login", authController.login);

// 회원가입 라우트
router.post("/register", authController.register);

module.exports = router;
