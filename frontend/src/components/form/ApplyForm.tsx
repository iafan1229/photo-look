"use client";
import React, { useState } from "react";
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
} from "antd";
import { RcFile } from "antd/es/upload";
import type { GetProp, UploadFile, UploadProps } from "antd";
import axios from "axios";

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

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ApplyForm = () => {
  const { RangePicker } = DatePicker;

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

  const uploadS3 = async (values: { upload: UploadedFile[] }) => {
    const beforeUpload = (newFile: RcFile, _newFileList: RcFile[]) => {
      const isJpgOrPng =
        newFile.type === "image/jpeg" ||
        newFile.type === "image/jpg" ||
        newFile.type === "image/gif" ||
        newFile.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        return;
      }
      const isLt2M = newFile.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        return;
      }
      // const is7Count = _newFileList.length <= 7;
      // if (!is7Count) {
      //   message.error("Image maximum count is 7");
      //   return;
      // }
    };

    const REGION = "ap-northeast-2";
    const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID;
    const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY;
    // 업로드할 파일 가져오기

    // AWS SDK 초기화
    AWS.config.update({
      region: REGION,
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    });

    let tmpFileArray: {
      name: string;
      type: string;
      fileObj: any;
      id: string;
    }[] = [];

    // values.upload.forEach((el, i) => {
    //   tmpFileArray.push({
    //     name: el.name,
    //     type: el.type,
    //     fileObj: el.originFileObj,
    //     id: el.uid,
    //   });
    // });

    // try {
    //   const results = await Promise.all(
    //     tmpFileArray.map(
    //       (file) =>
    //         new AWS.S3.ManagedUpload({
    //           params: {
    //             Bucket: "photolookbucket", // S3 버킷 이름
    //             Key: `img-upload/${file.id}`, // 업로드 파일 경로
    //             Body: file.fileObj, // File 객체
    //             ContentType: file.type, // 파일 MIME 타입
    //           },
    //         }).promise() // Promise로 변환
    //     )
    //   );
    //   console.log(results);
    // } catch (e) {
    //   console.error(e);
    // }
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);

    // S3 업로드 호출
    uploadS3(values).then((res) => {
      const data = axios.post("/api/auth/register", {
        body: {
          id: "testUser",
          password: "123456",
        },
      });
      console.log(data);
    });
  };

  const props = { multiple: true };
  const rangeConfig = {
    rules: [
      {
        type: "array" as const,
        required: true,
        message: "Please select time!",
      },
    ],
  };
  return (
    <div style={{ padding: "5vw" }}>
      <Form
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
          <Input style={{ maxWidth: 300 }} />
        </Form.Item>
        <Form.Item name='id' label='인스타그램 ID' required>
          <Input style={{ maxWidth: 300 }} />
        </Form.Item>

        <Form.Item
          name='upload'
          label='프로필 사진'
          valuePropName='fileList'
          getValueFromEvent={normFile}
          required
        >
          <Upload
            {...props}
            name='img-upload'
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
        </Form.Item>

        <Form.Item name='range-picker' label='원하는 게시기간' {...rangeConfig}>
          <RangePicker />
        </Form.Item>
        <Form.Item name='password' label='확인번호' required>
          <Input type='password' style={{ maxWidth: 300 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
            <Button htmlType='reset'>reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ApplyForm;
