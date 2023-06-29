import { Button, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import { callUpdateUser } from "../../service/api";

const ModalUpdateUser = (props) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Success:", values);
    const { _id, fullName, phone } = values;
    const res = await callUpdateUser({ _id, fullName, phone });
    console.log(res);
    if (res.data) {
      props.setDataUpdate({
        fullName: values.fullName,
        phone: values.phone,
      });
      props.setIsModalUpdateOpen(false);
      props.fetchUser();
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleCancel = () => {
    props.setIsModalUpdateOpen(false);
  };
  useEffect(() => {
    form.setFieldsValue(props.dataUpdate);
  }, [props.dataUpdate]);
  return (
    <div>
      <Modal
        title="Cập Nhật Người Dùng"
        onCancel={handleCancel}
        onOk={() => form.submit()}
        open={props.isModalUpdateOpen}
        okText="Cập Nhật"
        cancelText="Huỷ"
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 24,
          }}
          style={{
            maxWidth: 600,
          }}
          // initialValues={{
          //   remember: true,
          // }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên Hiển Thị"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input your fullName!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hidden
            label="Id"
            name="_id"
            rules={[
              {
                required: true,
                message: "Please input your Id!",
              },
            ]}
          >
            <Input />
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
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Phone"
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
        </Form>
      </Modal>
    </div>
  );
};

export default ModalUpdateUser;
