// server/src/routes/verificationRoutes.ts
import { Router } from "express";
const adminController = require("../controllers/adminController");

const router = Router();

// 이미지 업로드 및 알림
router.post("/upload", adminController.uploadImages); // S3 업로드
router.post("/user", adminController.createUser); // DB 저장
router.post("/notify", adminController.sendNotification); // 이메일 발송

// 사용자 데이터 조회
router.get("/details", adminController.getUserDetails);

// 매거진 승인
router.post("/approve", adminController.approveMagazine);

// 매거진 거절
router.post("/reject", adminController.rejectMagazine);

module.exports = router;
