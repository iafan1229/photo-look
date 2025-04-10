import { Response } from "express";
import { ResponseData, User } from "../types";
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

const list = async (_: never, res: Response<ResponseData>) => {
  try {
    const getList = await UserModel.find({}).then((data: User[]) => {
      return data;
    });

    res.status(201).json({ data: getList, message: "success" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { slider, list };
