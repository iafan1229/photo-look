const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 회원가입
const register = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    // 사용자 중복 확인

    const existingUser = await User.findOne({
      username,
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // // 비밀번호 해싱
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // 사용자 저장
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(404).json({ message: "Server error" });
  }
};

// 로그인
const login = async (req, res) => {
  const { username, password } = req.body;

  // 사용자 찾기
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  //   // JWT 생성
  //   const token = jwt.sign({ username: user.username }, "secretKey", {
  //     expiresIn: "1h",
  //   });

  res.status(200).json({ message: "Login successful", token });
};

module.exports = { register, login };
