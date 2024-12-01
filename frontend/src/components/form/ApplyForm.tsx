"use client";
import React from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  ColorPicker,
  Descriptions,
  Form,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Upload,
} from "antd";
import Title from "antd/es/typography/Title";

const { Option } = Select;

const normFile = (e: any) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const onFinish = (values: any) => {
  console.log("Received values of form: ", values);
};

const ApplyForm = () => {
  return (
    <div style={{ padding: "5vw" }}>
      <Form
        name='validate_other'
        onFinish={onFinish}
        initialValues={{
          "input-number": 3,
          "checkbox-group": ["A", "B"],
          rate: 3.5,
          "color-picker": null,
        }}
      >
        <Form.Item
          name='upload'
          label='사진 업로드'
          valuePropName='fileList'
          getValueFromEvent={normFile}
        >
          <Upload name='logo' action='/upload.do' listType='picture'>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
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
