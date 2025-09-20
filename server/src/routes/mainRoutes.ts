// server/src/routes/mainRoutes.ts
import { Router } from "express";
const mainController = require("../controllers/mainController");

const router = Router();

// 매거진 목록 조회
router.get("/list", mainController.list);

// // 슬라이더 데이터 조회
// router.get("/list-slider", mainController.slider);

module.exports = router;
