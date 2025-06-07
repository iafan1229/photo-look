import { Request, Response } from "express";
import { RequestData, ResponseData, User } from "../types";
const nodemailer = require("nodemailer");
const UserModel = require("../models/User");

const slider = async (_: never, res: Response<ResponseData>) => {
  // try {
  //   const getList = await UserModel.find({}).then((data: User[]) => {
  //     return data.map((el) => el.upload[1]);
  //   });
  //   res.status(201).json({ data: getList });
  // } catch (err) {
  //   console.log(err);
  // }
};

const list = async (req: Request<RequestData>, res: Response<ResponseData>) => {
  try {
    // 검색 파라미터 추출
    const { total, name, sns, title } = req.query;
    console.log(req.query);
    if (total) {
      const allData = await UserModel.find({});
      return res.status(200).json({
        data: allData,
        message: "success",
        total: allData.length,
      });
    }

    // 검색 조건 객체 생성
    let searchQuery: any = {};

    // 이름 검색 필터 추가
    if (name) {
      searchQuery.name = { $regex: name, $options: "i" }; // 대소문자 구분 없이 부분 일치 검색
    }

    // SNS 아이디 검색 필터 추가
    if (sns) {
      searchQuery.sns = { $regex: sns, $options: "i" };
    }

    // 앨범 제목 검색 필터 추가
    if (title) {
      searchQuery["magazine.title"] = { $regex: title, $options: "i" };
    }

    // 검색 쿼리 실행
    const getList = await UserModel.find(searchQuery).then((data: User[]) => {
      return data;
    });

    res.status(200).json({
      data: getList,
      message: "success",
      total: getList.length,
    });
  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({
      message: "데이터를 불러오는 중 오류가 발생했습니다.",
    });
  }
};

module.exports = { slider, list };
