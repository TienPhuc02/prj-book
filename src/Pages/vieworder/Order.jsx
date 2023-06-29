import {
  Button,
  Col,
  Divider,
  Empty,
  InputNumber,
  Layout,
  Row,
  Space,
  Steps,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import "./index.scss";
import {
  doDeleteItemCartAction,
  doUpdateOrder,
} from "../../redux/order/orderSlice";

const Order = (props) => {
  const orderList = useSelector((state) => state.order.cart);
  const [currentStep, setCurrentStep] = useState(0);
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

  useEffect(() => {
    let sum = 0;
    orderList.map((item) => {
      sum += item.detail.price * item.quantity;
    });
    setTotalPrice(sum);
  }, [orderList]);
  const description = "This is a description.";
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
        {/* <div
          style={{
            margin: "10px 20px 10px 10px ",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <Steps
            current={currentStep}
            items={[
              {
                title: "Đơn hàng",
              },
              {
                title: "Đặt hàng",
              },
              {
                title: "Thanh toán",
              },
            ]}
          />
        </div> */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            className="order-top-left"
            style={{
              width: "100%",
              // width: "60%",
              height: "auto",
              // backgroundColor: "white",
              margin: "10px ",
            }}
          >
            {orderList.length === 0 ? (
              <Empty
                style={{ backgroundColor: "white" }}
                description={"không có sản phẩm nào trong giỏ hàng"}
              />
            ) : (
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
              // width: "40%",
              height: "auto",
              backgroundColor: "white",
              margin: "10px ",
            }}
          >
            <div
              className="item-text"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Tạm tính </span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            </div>
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
              <button className="now" onClick={() => props.handleBuyNow()}>
                Mua ngay({orderList?.length ?? 0})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
