import { Response } from "express";
import { ResponseData, User } from "../../types";
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

const email = async (req: any, res: any) => {
  const { to, subject, message } = req.body;
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h1 style="color: #4CAF50;">Hello!</h1>
    <p>${message}</p>
    <footer style="margin-top: 20px; color: #888;">
      <p>Best regards,</p>
      <p><strong>Your Company</strong></p>
    </footer>
  </div>
`;

  // Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "iafan103603@gmail.com",
      pass: "rzrb tmdr idxj sesp",
    },
  });

  try {
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to,
      subject,
      html: htmlContent,
    });
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
};

module.exports = { slider, list, email };
