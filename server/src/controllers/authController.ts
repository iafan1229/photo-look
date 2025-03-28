const bcrypt = require("bcrypt");
import { Response } from "express";
import { ResponseData, User } from "../../types";
const UserModel = require("../models/User");

// 회원가입
const register = async (
  { body }: { body: User },
  res: Response<ResponseData>
) => {
  try {
    const {
      instagramId,
      imageUrls,
      magazineTitle,
      storyTheme,
      magazineStyle,
      analyzedImages,
    } = body;

    // 필수 필드 검증
    if (!instagramId) {
      return res.status(400).json({
        message: "필수 입력값이 누락되었습니다.",
      });
    }

    // // 이미 존재하는 사용자인지 확인
    // const existingUser = await UserModel.findOne({ instagramId });
    // if (existingUser) {
    //   return res.status(400).json({
    //     message: "이미 등록된 인스타그램 아이디입니다.",
    //   });
    // }

    // 사용자 저장
    const saveUser = await new UserModel({
      instagramId,
      imageUrls: imageUrls,
      magazine: {
        title: magazineTitle,
        theme: storyTheme,
        style: magazineStyle,
        analyzedImages: analyzedImages,
        createdAt: new Date(),
      },
    }).save();

    // 성공적인 응답
    res.status(201).json({
      message: "매거진이 성공적으로 발행되었습니다.",
      data: {
        instagramId: saveUser.instagramId,
        magazineTitle: saveUser.magazine.title,
        imageCount: saveUser.magazine.analyzedImages.length,
      },
    });
  } catch (error) {
    console.error("매거진 발행 중 오류 발생:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
};

module.exports = { register };
