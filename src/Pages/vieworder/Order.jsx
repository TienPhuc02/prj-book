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
  const calculateTotalQuantity = (itemId) => {
    return orderList.reduce((total, item) => {
      if (item.detail._id === itemId) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };
  const handleChangeOrder = (value, item) => {
    const totalQuantity = calculateTotalQuantity(item.detail._id);
    if (!isNaN(value)) {
      // Giới hạn tối đa là item.detail.quantity
      const maxValue = item.detail.quantity;
      if (value > maxValue) {
        value = maxValue; // Giới hạn giá trị nhập vào không được vượt quá item.detail.quantity
      }

      if (value >= 0) {
        // Kiểm tra giá trị không nhỏ hơn 0
        if (value === -1 && item.quantity === 1) {
          // Chỉ cho phép giảm tối đa là 1
          console.log("Không thể giảm thêm");
        } else {
          dispatch(
            doUpdateOrder({
              quantity: value,
              detail: item,
              _id: item.detail._id,
            })
          );
        }
      } else {
        // Xử lý khi giá trị nhập là số âm
        console.log("Số lượng không hợp lệ!");
      }
    } else {
      // Xử lý khi giá trị nhập không hợp lệ
      console.log("Giá trị không hợp lệ!");
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
  const handleDeleteOrder = (itemId) => {
    dispatch(doDeleteItemCartAction({ _id: itemId }));

    // Sau khi xóa thành công, load lại trang
    // window.location.reload();
  };
  return (
    <div className="order-container">
      {/* {orderList.length === 0 ? (
        // Hiển thị khi không có đơn hàng
        <Empty
          style={{ backgroundColor: "white" }}
          description={"không có sản phẩm nào trong giỏ hàng"}
        />
      ) :  */}
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
              // width: "60%",
              height: "auto",
              // backgroundColor: "white",
              margin: "10px ",
            }}
          >
            {orderList.length !== 0 &&
              orderList.length > 0 &&
              orderList.map((item, index) => {
                console.log(item.detail._id);
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
                        step={1} // Giới hạn bước là 1
                        min={1} // Giới hạn giá trị tối thiểu là 1
                        max={1000} // Giới hạn giá trị tối đa là 1000 hoặc giá trị max tối đa của item.detail.quantity
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
                        onClick={() => handleDeleteOrder(item.detail._id)}
                      />
                    </span>
                  </div>
                );
              })}
          </div>
          {orderList.length === 0 ? null : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
