import React, { useState } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import { Button, Divider, Form, Input, message, notification } from "antd";
import { callAPICreateLogin } from "../../service/api";
import { Link, useNavigate } from "react-router-dom";
import { doLoginAction } from "../../redux/account/accountSlice";
const LoginPage = () => {
  const [isSubmit, SetIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { username, password } = values;
    SetIsSubmit(true);
    const res = await callAPICreateLogin(username, password);
    console.log("🚀 ~ file: index.jsx:16 ~ onFinish ~ res:", res);
    SetIsSubmit(false);
    if (res && res?.data && res?.data?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      const slug = localStorage.getItem("slug");
      const bookId = localStorage.getItem("bookId");
      const url_view_order = localStorage.getItem("url_view_order");
      dispatch(doLoginAction(res.data.data));
      message.success(res.data?.data?.fullName);
      notification.success({
        message: "Trạng Thái Đăng Nhập",
        description: "Bạn Đã Đăng Nhập Thành Công",
      });
      if (slug && bookId) {
        console.log("Navigate to /book");
        navigate(`/book/${slug}?id=${bookId}`);
      }
      if (url_view_order) {
        console.log("Navigate to /view order");
        navigate(`/${url_view_order}`);
      } else {
        navigate("/");
      }
    } else {
      notification.error({
        message: "Trạng Thái Đăng Nhập",
        description: "Bạn Đã Đăng Nhập Thất Bại",
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div
      style={{
        backgroundColor: "#F0F2F5",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          display: "inline-block",
          borderRadius: "10px",
          padding: "10px 10px 20px 10px ",
          boxShadow:
            " 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto",
            alignItems: "center",
            padding: "40px",
          }}
          // defaultValue={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            style={{ textAlign: "center" }}
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Button
              style={{
                //   fontSize: "17px",
                //   // fontWeight: "bold",
                //   color: "white",
                marginLeft: "100px",
              }}
              type="primary"
              htmlType="submit"
              loading={isSubmit}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Divider></Divider>
        <p style={{ textAlign: "center" }}>
          <Link style={{ marginLeft: "10px" }} to={"/register"}>
            <Button
              type="primary"
              // style={{
              //   backgroundColor: " #42b72a",
              //   fontSize: "17px",
              //   fontWeight: "10px",
              //   color: "white",
              // }}
            >
              Tạo tài khoản mới
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
