// server/src/routes/verificationRoutes.ts
import { Router } from "express";
const adminController = require("../controllers/adminController");

const router = Router();

// 이미지 업로드 및 알림
router.post("/upload-to-s3-and-notify", adminController.uploadToS3AndNotify);

// 사용자 데이터 조회
router.get("/details", adminController.getUserDetails);

// 매거진 승인
router.post("/approve", adminController.approveMagazine);

// 매거진 거절
router.post("/reject", adminController.rejectMagazine);

module.exports = router;
