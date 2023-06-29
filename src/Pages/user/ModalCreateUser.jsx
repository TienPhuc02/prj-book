import { Modal } from "antd";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";

const ModalCreateUser = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };
  // const onFinish = (values) => {
  //   console.log("Success:", values);
  // };
  return (
    <div>
      <Modal
        okText="Tạo mới"
        cancelText="Huỷ"
        onOk={() => form.submit()}
        title="Thêm mới người dùng"
        open={props.isModalOpen}
        onCancel={handleCancel}
        confirmLoading={isLoading}
      >
        <Form
          form={form}
          onFinish={props.handleSubmitCreateUser}
          name="basic"
          wrapperCol={24}
          // initialValues={{
          //   remember: true,
          // }}
          autoComplete="off"
        >
          <Form.Item
            label="Tên hiển thị"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          ></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalCreateUser;
