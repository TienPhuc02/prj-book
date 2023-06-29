import React from "react";
import { Button, Col, Form, Input, Row } from "antd";
const SearchBook = (props) => {
  return (
    <div>
      <Form form={props.form} onFinish={props.handleSubmiteSearch}>
        <Row justify="space-between">
          <Col span={6}>
            <Form.Item label="Tên sách" name="mainText">
              <Input></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Tác giả" name="author">
              <Input></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Thể loại" name="category">
              <Input></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ float: "right", margin: "30px 0px" }}>
          <Button htmlType="submit" type="primary">
            Search
          </Button>
          <Button onClick={props.handleClear} style={{ marginLeft: "10px" }}>
            Clear
          </Button>
        </Row>
      </Form>
    </div>
  );
};

export default SearchBook;
