import { Avatar, Button, Checkbox, Form, Input } from "antd";
import { Col, Row } from "antd";
import React from "react";
import "./index.scss";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Upload, message } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callUpdateUser, callUploadAvatar } from "../../service/api";
import {
  doUpdateAccountAction,
  doUploadAvatarAccountAction,
} from "../../redux/account/accountSlice";
const updateUser = (props) => {
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);
    const data = {
      fullName: values.fullName,
      phone: values.phone,
      avatar: values.avatar,
      _id: values._id,
    };
    const res = await callUpdateUser(data);
    // console.log(res);
    if (res && res.data) {
      dispath(doUpdateAccountAction(data));
      props.handleCancel();
      localStorage.removeItem("access_token");
    }
  };
  // const form = Form.useForm();
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const user = useSelector((state) => state?.account?.user);
  const [userAvatar, setUserAavatar] = useState(user?.avatar ?? "");
  const dispath = useDispatch();
  const [form] = Form.useForm();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
    }
    if (info.file.status === "done") {
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const res = await callUploadAvatar(file);
    dispath(doUploadAvatarAccountAction(res.data.fileUploaded));
    form.setFieldsValue({ avatar: res.data.fileUploaded });
    onSuccess("ok");
  };
  const propsUpload = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    customRequest: handleUploadAvatar,
    onChange(info) {
      // console.log(info);
      if (info.file.status !== "uploading") {
        // console.log(info.file.originFileObj.name);
        // setImageUrl(
        //   `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
        //     info.file.originFileObj.name
        //   }`
        // );
      }
      if (info.file.status === "done") {
      } else if (info.file.status === "error") {
      }
    },
  };
  return (
    <div>
      <Form
        // name="basic"
        form={form}
        labelCol={{
          span: 12,
        }}
        initialValues={{
          _id: user?.id,
          email: user?.email,
          fullName: user.fullName,
          phone: user.phone,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <Form.Item name={"avatar"}>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                  user.avatar
                }`}
              />
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col className="gutter-row input-update" span={12}>
            <Form.Item
              hidden={true}
              label="Id"
              name="_id"
              rules={[
                {
                  // required: true,
                  message: "Please input your id!",
                },
              ]}
            >
              <Input disabled defaultValue={user.id} />
            </Form.Item>
            <Form.Item
              label="Email"
              // name="email"
              rules={[
                {
                  // required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input disabled defaultValue={user.email} />
            </Form.Item>
            <Form.Item
              label="Tên hiển thị"
              name="fullName"
              rules={[
                {
                  // required: true,
                  message: "Please input your fullName!",
                },
              ]}
            >
              <Input defaultValue={user.fullName} />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  // required: true,
                  message: "Please input your phone !",
                },
              ]}
            >
              <Input defaultValue={user.phone} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit"> Cập nhật</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default updateUser;
