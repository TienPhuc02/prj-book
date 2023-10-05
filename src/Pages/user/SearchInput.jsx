import React, { useState } from "react";
import { Col, Form, Row } from "antd";
import { Button, Input } from "antd";
const SearchInput = (props) => {
  const [form] = Form.useForm();
  // var [query, setQuery] = useState("");
  const onFinish = (values) => {
    let query = "";
    if (values.fullName) {
      query += `&fullName=/${values.fullName}/i`;
    }
    if (values.email) {
      query += `&email=/${values.email}/i`;
    }
    if (values.phone) {
      query += `&phone=/${values.phone}/i`;
    }
    if (values.email && values.phone) {
      query += `&email=/${values.email}/i&phone=/${values.phone}/`;
    }
    if (values.email && values.fullName) {
      query += `&email=/${values.email}/i&fullName=/${values.fullName}/`;
    }
    if (values.phone && values.fullName) {
      query += `&phone=/${values.email}/i&fullName=/${values.fullName}/`;
    }
    if (values.phone && values.fullName && values.email) {
      query += `&phone=/${values.email}/i&fullName=/${values.fullName}/&email=/${values.email}/`;
    }
    if (query) {
      props.handleSearch(query);
    }
  };
  const handleClear = async () => {
    form.resetFields(["fullName"]);
    form.resetFields(["email"]);
    form.resetFields(["phone"]);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row>
          <Col span={8}>
            <Form.Item label="fullName" name="fullName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Số Điện thoại" name="phone">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ float: "right" }}>
          <Form.Item style={{ marginRight: "10px" }}>
            <Button  className="bg-[#4096ff]" type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
          <Form.Item>
            <Button  className="bg-[#4096ff] text-white" onClick={handleClear} htmlType="submit">
              Clear
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default SearchInput;
