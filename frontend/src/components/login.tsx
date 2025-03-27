"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface InputData {
  userName: string;
  password: string;
}

const Login = ({
  userId,
  setUserId,
}: {
  userId?: string;
  setUserId?: React.Dispatch<SetStateAction<string | undefined>>;
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
    fetch("/api/login", {
      // API URL을 Flask 서버에 맞게 조정
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // setUserId(data?.userId);
          const getContent = async () => {
            const response = axios.get(
              `/api/getContent?userId=${data?.userId}`
            );
            console.log(response);
          };
          const data3 = getContent();
          console.log(data3);
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
