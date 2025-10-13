// server/src/controllers/mainController.ts - 간단한 리팩토링 버전
import { Request, Response } from "express";
import { RequestData, ResponseData } from "../types";
import { mainService } from "../services/mainServices";

const list = async (req: Request<RequestData>, res: Response<ResponseData>) => {
  try {
    const { total, name, sns, title, page, limit } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;

    if (total) {
      // Service Layer 사용 - 전체 매거진 조회 (페이지네이션)
      const result = await mainService.getAllMagazines(pageNum, limitNum);
      return res.status(200).json({
        data: result.magazines,
        message: "success",
        total: result.total,
        pagination: {
          currentPage: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(result.total / limitNum),
          hasMore: pageNum * limitNum < result.total,
        },
      });
    }

    const searchParams = {
      name: name as string | undefined,
      sns: sns as string | undefined,
      title: title as string | undefined,
    };
    const result = await mainService.searchMagazines(searchParams, pageNum, limitNum);

    res.status(200).json({
      data: result.magazines,
      message: "success",
      total: result.total,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(result.total / limitNum),
        hasMore: pageNum * limitNum < result.total,
      },
    });
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({
      message: "데이터를 불러오는 중 오류가 발생했습니다.",
    });
  }
};

// const slider = async (_: never, res: Response<ResponseData>) => {
//   try {
//     // Service Layer 사용 - 슬라이더 데이터 조회
//     const sliderData = await mainService.getAllMagazines();
//     res.status(200).json({
//       data: sliderData,
//       message: "success",
//     });
//   } catch (err) {
//     console.error("Error fetching slider data:", err);
//     res.status(500).json({
//       message: "슬라이더 데이터를 불러오는 중 오류가 발생했습니다.",
//     });
//   }
// };

module.exports = { list };
