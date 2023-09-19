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
import Order from "./Order";
import OrderPLace from "./OrderPlace";
import ResultOrder from "./ResultOrder";
const index = () => {
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
  const handleBuyNow = () => {
    const totalQuantity = orderList.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    if (totalQuantity <= 1000) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Số lượng mua hàng vượt quá giới hạn (1000).");
    }
  };
  useEffect(() => {
    if (orderList.length > 0) {
      setCurrentStep(currentStep + 1);
    }
  }, []);
  useEffect(() => {
    let sum = 0;
    orderList.map((item) => {
      sum += item.detail.price * item.quantity;
    });
    setTotalPrice(sum);
  }, [orderList]);
  console.log(currentStep);
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
        <div
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
        </div>
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
            {orderList.length === 0 && (
              <Empty
                style={{ backgroundColor: "white" }}
                description={"không có sản phẩm nào trong giỏ hàng"}
              />
            )}
            <div>
              <div>
                {currentStep === 1 && (
                  <Order
                    handleBuyNow={handleBuyNow}
                    setCurrentStep={setCurrentStep}
                    currentStep={currentStep}
                  />
                )}
              </div>
              <div>
                {currentStep === 2 && (
                  <OrderPLace
                    setCurrentStep={setCurrentStep}
                    currentStep={currentStep}
                  />
                )}
              </div>
              <div>{currentStep === 3 && <ResultOrder />}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="order-bottom"
        style={{ display: "flex", justifyContent: "center" }}
      >
        HUST Project
      </div>
    </div>
  );
};

export default index;
