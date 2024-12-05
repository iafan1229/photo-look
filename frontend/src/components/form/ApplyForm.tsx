"use client";
import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import AWS from "aws-sdk";
import {
  Button,
  Checkbox,
  Col,
  ColorPicker,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Image,
  Space,
  Switch,
  Upload,
  message,
  notification,
} from "antd";
import { RcFile } from "antd/es/upload";
const { RangePicker } = DatePicker;
import moment, { Moment } from "moment";

import type { FormProps, GetProp, UploadFile, UploadProps } from "antd";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

interface UploadedFile {
  uid: string;
  lastModified: number;
  lastModifiedDate: string;
  name: string;
  size: number;
  type: string;
  percent: number;
  originFileObj: File;
  error: { status: number; method: string; url: string };
  response: string;
}
type FieldType = {
  name: string;
  instagramId: string;
  email: string;
  upload: UploadedFile[];
  date?: [Moment, Moment];
  password: string;
  textarea?: string;
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ApplyForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const formRef = useRef<HTMLFormElement | null>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const sendEmail = async (formRef: HTMLFormElement) => {
      try {
        const response = emailjs
          .sendForm("service_bbuw8qx", "template_jrygo5e", formRef, {
            publicKey: "kOPf18Wgt8SsZZvM9",
          })
          .then(
            () => {
              console.log("SUCCESS!");
            },
            (error) => {
              console.log("FAILED...", error.text);
            }
          );
        console.log(response);
        api.success({ message: "관리자에게 메일을 보냈습니다." });
        return response;
      } catch (error: any) {
        api.error({
          message: error.response?.data || error.message || "이메일 전송 실패",
        });
        throw error;
      }
    };

    const uploadS3 = async (files: UploadedFile[]) => {
      console.log(files);
      AWS.config.update({
        region: "ap-northeast-2",
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
      });

      try {
        const results = await Promise.all(
          files.map((file) =>
            new AWS.S3.ManagedUpload({
              params: {
                Bucket: "photolookbucket",
                Key: `img-upload/${file.uid}`,
                Body: file.originFileObj,
                ContentType: file.type,
              },
            }).promise()
          )
        );

        api.success({ message: "이미지를 서버에 저장했습니다." });
        return results;
      } catch (error) {
        api.error({ message: "이미지 업로드 실패" });
        throw error;
      }
    };

    const registerUser = async (values: FieldType, uploadedFiles: any) => {
      try {
        const response = await axios.post("/api/auth/register", {
          name: values.name,
          instagramId: values.instagramId,
          email: values.email,
          upload: uploadedFiles.map((el: any) => el.Location),
          date: values.date,
          password: values.password,
          textarea: values.textarea,
        });

        api.success({ message: "사용자 등록 완료" });
        return response.data;
      } catch (error: any) {
        api.error({
          message: error.response?.data || error.message || "사용자 등록 실패",
        });
        throw error;
      }
    };

    try {
      formRef.current = document.getElementById("myForm") as HTMLFormElement;

      // 이메일 전송
      if (formRef.current) {
        // await sendEmail(formRef.current);

        // S3 업로드
        console.log(values);
        const uploadedFiles = await uploadS3(values.upload);

        // 사용자 등록
        await registerUser(values, uploadedFiles);
      }
    } catch (error) {
      console.error("프로세스 중 에러 발생:", error);
    }
  };

  const props = { multiple: true };
  const rangeConfig = {
    rules: [
      {
        type: "array" as const,
        required: false,
        message: "Please select time!",
      },
    ],
  };

  return (
    <div style={{ padding: "5vw" }}>
      <Form
        id='myForm'
        name='register-form'
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{
          border: "12px solid #f2eefa",
          borderRadius: 6,
          padding: 30,
          maxWidth: 1200,
          margin: "0 auto",
        }}
        className='register-form'
        layout='horizontal'
      >
        <legend style={{ borderBottomWidth: 2, fontSize: 20 }}>
          <h1>Application</h1>
        </legend>
        <Form.Item name='name' label='이름' required>
          <Input style={{ maxWidth: 600 }} />
        </Form.Item>
        <Form.Item name='instagramId' label='인스타그램 ID' required>
          <Input style={{ maxWidth: 600 }} />
        </Form.Item>
        <Form.Item name='email' label='이메일' required>
          <Input style={{ maxWidth: 600 }} />
        </Form.Item>
        <Form.Item label='Dragger'>
          <Form.Item
            name='upload'
            valuePropName='fileList'
            getValueFromEvent={normFile}
            style={{ maxWidth: 600 }}
          >
            <Upload.Dragger name='files' beforeUpload={() => false} {...props}>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>
                클릭, 또는 아이템을 드래그해주세요
              </p>
              <p className='ant-upload-hint'>
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
        {/* <Form.Item
          name='upload'
          label='프로필 사진'
          getValueFromEvent={normFile}
          required
        >
          <Upload
            {...props}
            listType='picture'
            beforeUpload={() => false}
            onPreview={handlePreview}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>

          {previewImage && (
            <Image
              style={{ maxWidth: 1200 }}
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form.Item> */}

        <Form.Item name='date' label='원하는 게시기간' {...rangeConfig}>
          <RangePicker style={{ maxWidth: 600 }} />
        </Form.Item>
        <Form.Item name='password' label='확인번호' required>
          <Input type='password' style={{ maxWidth: 600 }} />
        </Form.Item>
        <Form.Item name='textarea' label='신청 메시지'>
          <TextArea
            style={{ maxWidth: 600 }}
            value='신청 메시지를 작성해주세요'
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              운영자에게 가입이메일 보내기
            </Button>

            <Button htmlType='reset'>reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ApplyForm;
