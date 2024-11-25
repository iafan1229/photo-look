"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InputData {
  userName: string;
  password: string;
}

const Login = ({
  userId,
  setUserId,
}: {
  userId?: string;
  setUserId: React.Dispatch<SetStateAction<string | undefined>>;
}) => {
  const router = useRouter();
  const [inputData, setInputData] = useState<InputData>({
    userName: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 엔터 키가 눌리면 API 호출
      validate();
      sendInputData(inputData);
    }
  };

  const sendInputData = (data: InputData) => {
    fetch("/api/v1/search/blog?query=이하영+개발블로그", {
      // API URL을 Flask 서버에 맞게 조정
      method: "GET",
      headers: {
        "X-Naver-Client-Id": "OAMtf141zpQSdpoWr0Qm",
        "X-Naver-Client-Secret": "6Vdf3GDwjF",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setUserId(data?.userId);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLogin = () => {
    if (validate()) sendInputData(inputData);
  };

  const validate = () => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?~`\\-])(?=.{8,}).*$/;

    if (passwordRegex.test(inputData.password)) {
      return true;
    } else {
      alert("비밀번호는 영문 숫자 특수문자 포함하세요");
      return false;
    }
  };

  return (
    <div>
      <h2>Instagram Login</h2>
      <input
        type='text'
        name='userName'
        placeholder='Username'
        value={inputData.userName}
        onChange={handleChange} // 사용자 이름 변경 감지
        onKeyPress={handleKeyPress} // 엔터 키 감지
      />
      <input
        type='password'
        name='password'
        placeholder='Password'
        value={inputData.password}
        onChange={handleChange} // 비밀번호 변경 감지
        onKeyPress={handleKeyPress} // 엔터 키 감지
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
