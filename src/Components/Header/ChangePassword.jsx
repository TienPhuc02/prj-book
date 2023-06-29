import { Button, Checkbox, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { callChangePassword } from "../../service/api";
const ChangePassword = (props) => {
  const user = useSelector((state) => state?.account?.user);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    console.log("Success:", values);
    const data = {
      email: user?.email,
      oldpass: values.password,
      newpass: values.newpassword,
    };
    console.log(data.email);
    const res = await callChangePassword(data);
    console.log(res);
    if (res && res.data) {
      props.handleCancel();
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            message: "Please input your password!",
          },
        ]}
      >
        <Input disabled defaultValue={user?.email} />
      </Form.Item>
      <Form.Item
        label="Mật khẩu cũ"
        name="password"
        rules={[
          {
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="mật khẩu mới"
        name="newpassword"
        rules={[
          {
            //   required: true,
            message: "Please input your new password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Cập nhật mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
