import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Space,
  Steps,
  message,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import "./index.scss";
import {
  doDeleteItemCartAction,
  doPlaceOrderAction,
  doUpdateOrder,
} from "../../redux/order/orderSlice";
import { callCreateAnBook } from "../../service/api";

const OrderPlace = (props) => {
  const orderList = useSelector((state) => state.order.cart);
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();
  console.log(orderList);
  const [totalPrice, setTotalPrice] = useState(0);
  const handleChangeOrder = (value, item) => {
    console.log("changed", value, item);
    if (!isNaN(value)) {
      dispatch(
        doUpdateOrder({ quantity: value, detail: item, _id: item.detail._id })
      );
    }
  };
  const [form] = Form.useForm();
  useEffect(() => {
    let sum = 0;
    orderList.map((item) => {
      sum += item.detail.price * item.quantity;
    });
    setTotalPrice(sum);
  }, [orderList]);
  console.log(totalPrice);
  const onFinish = async (values) => {
    console.log("Success:", values);
    const orderDetail = orderList.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item.detail._id,
      };
    });
    let data = {
      name: values.mainText,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: orderDetail,
    };
    const res = await callCreateAnBook(data);
    console.log(res);
    if (res && res.data) {
      message.success("đặt hàng thành công");
      props.setCurrentStep(props.currentStep + 1);
      dispatch(doPlaceOrderAction());
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="order-container">
      <div
        className="order-top"
        style={{
          display: "flex",
          backgroundColor: "#EFEEF0",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            className="order-top-left"
            style={{
              width: "100%",
              height: "auto",
              margin: "10px ",
            }}
          >
            {orderList.length === 0 ? (
              <Empty
                style={{ backgroundColor: "white" }}
                description={"không có sản phẩm nào trong giỏ hàng"}
              />
            ) : (
              orderList &&
              orderList.length > 0 &&
              orderList.map((item, index) => {
                return (
                  <div
                    key={item.detail._id}
                    style={{
                      margin: "10px 0px 10px 10px ",
                      display: "flex",
                      backgroundColor: "white",
                    }}
                  >
                    <img
                      style={{ width: "100px", height: "100px" }}
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        item.detail.thumbnail
                      }`}
                      alt=""
                    />
                    <span
                      className="item-text"
                      style={{
                        margin: "0px 10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.detail.mainText}
                    </span>
                    <span
                      className="item-text"
                      style={{
                        margin: "0px 5px 0px 5px ",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price)}
                    </span>
                    <span
                      className="input-number"
                      style={{
                        margin: "0px 5px 0px 5px ",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <InputNumber
                        key={item.detail._id}
                        style={{
                          height: "30px",
                        }}
                        value={item.quantity}
                        onChange={(value) => handleChangeOrder(value, item)}
                        step={1}
                        min={0}
                      />
                    </span>
                    <span
                      className="item-text"
                      style={{
                        margin: "0px 5px 0px 5px  ",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Total :
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price * item.quantity)}
                    </span>
                    <span
                      style={{
                        margin: "0px 5px 0px 5px  ",
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="delete-icon"
                    >
                      <DeleteOutlined
                        onClick={() =>
                          dispatch(
                            doDeleteItemCartAction({ _id: item.detail._id })
                          )
                        }
                      />
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div
            className="order-top-right"
            style={{
              padding: "10px",
              height: "auto",
              backgroundColor: "white",
              margin: "10px ",
            }}
          >
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 24,
              }}
              defaultValue={{
                remember: true,
              }}
              onFinish={(value) => onFinish(value)}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Tên người nhận"
                name="mainText"
                initialValue={user.fullName}
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
                label="Số điện thoại"
                name="phone"
                initialValue={user.phone}
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address!",
                  },
                ]}
              >
                <Input style={{ height: "auto" }} />
              </Form.Item>
            </Form>
            <Form.Item
              label="Phương thức thanh toán"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <div>Thanh toán khi nhận hàng</div>
            </Form.Item>

            <Divider></Divider>
            <div
              className="item-text"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Tổng Tiền</span>
              <span style={{ color: "#ee4d2d", fontSize: "30px" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            </div>
            <Divider></Divider>
            <div
              className="item-text btn-buy-now"
              style={{ display: "flex", textAlign: "center" }}
            >
              <button className="now" onClick={() => form.submit()}>
                Đặt hàng ({orderList?.length ?? 0})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlace;
