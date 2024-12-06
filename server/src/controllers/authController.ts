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
    const { name, instagramId, email, upload, date, password, textarea } = body;

    // // 사용자 중복 확인
    // const existingUser = await UserModel.findOne({ name: username });
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    // // 비밀번호 해싱
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 저장
    const saveUser = await new UserModel({
      name,
      instagramId,
      email,
      upload,
      date,
      password,
      textarea,
    }).save();

    // 성공적인 응답
    res.status(201).json({
      message: "User registered successfully",
      data: {
        name: saveUser.name,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register };
