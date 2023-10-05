import { Tabs } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Modal, Popover, Space, message } from "antd";
import "./index.scss";
import { DiReact } from "react-icons/di";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Select } from "antd";
import { callLogOut } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlice";
import UpdateUser from "../Header/UpdateUser";
import ChangePassword from "./ChangePassword";
import { doClearCart } from "../../redux/order/orderSlice";
const Header = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderNumber = useSelector((state) => state?.order?.cart?.length);
  const onSearch = (value) => console.log(value);
  const onChangeSearch = (value) => console.log(value);
  const login = useSelector((state) => state?.account?.isAuthenticated);
  const user = useSelector((state) => state?.account?.user);
  console.log("🚀 ~ file: index.jsx:24 ~ Header ~ user:", user.role.name);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [arrowAtCenter, setArrowAtCenter] = useState(false);
  const orderList = useSelector((state) => state.order.cart);
  const [selectValue, setSelectValue] = useState(`Welcome ${user?.fullName}`);
  const [initialSelectValue, setInitialSelectValue] = useState(
    `Welcome ${user?.fullName}`
  );
  const text = <span className="text-center">Sản phẩm mới thêm</span>;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setSelectValue(initialSelectValue);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setSelectValue(initialSelectValue);
    setIsModalOpen(false);
  };
  const handleViewOrder = () => {
    localStorage.setItem("url_view_order", "vieworder");
    if (login) {
      navigate("/vieworder");
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    setSelectValue(`Welcome ${user?.fullName}`);
    setInitialSelectValue(`Welcome ${user?.fullName}`);
  }, [user?.fullName]);
  const content = (
    <>
      <div>
        {orderList &&
          orderList.length > 0 &&
          orderList.map((item, index) => {
            return (
              <div key={index} style={{ display: "flex", marginTop: "10px" }}>
                <img
                  style={{ display: "block", width: "50px", height: "50px" }}
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    item.detail.thumbnail
                  }`}
                  alt=""
                />
                <span>{item.detail.mainText}</span>
                <span style={{ color: "#EE4C2D", marginLeft: "10px" }}>
                  {item.detail.price} đ
                </span>
              </div>
            );
          })}
      </div>
      <div className="text-center">
      <button
        className="bg-[#4096ff] rounded-[10px] p-[5px] text-white text-[13px]"
        onClick={() => handleViewOrder()}
        // style={{
        //   margin: "10px 0px 0px 400px",
        //   background: "#ee4d2d",
        //   color: "white",
        //   borderRadius: "5px",
        //   padding: "10px",
        // }}
      >
        Xem giỏ hàng
      </button>
      </div>
    </>
  );
  const mergedArrow = useMemo(() => {
    if (arrowAtCenter)
      return {
        pointAtCenter: true,
      };
  }, [arrowAtCenter]);
  const options = [
    {
      value: "Quản lí tài khoản",
      label: "Quản lí tài khoản",
    },
    {
      value: "lịch sử mua hàng",
      label: "Lịch sử mua hàng",
    },
    {
      value: "Đăng Xuất",
      label: "Đăng Xuất",
    },
  ];
  if (user?.role?.name === "ADMIN") {
    options.unshift({
      value: "Trang Quản Trị",
      label: "Trang Quản Trị",
    });
  }
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const handleLogOut = async () => {
    const res = await callLogOut();
    if (res.data) {
      dispatch(doClearCart());
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công!");
      navigate("/");
    }
  };
  // console.log(user.avatar);
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  const onChangeTab = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: `Cập nhật thông tin`,
      children: (
        <div>
          <UpdateUser handleCancel={handleCancel}></UpdateUser>
        </div>
      ),
    },
    {
      key: "2",
      label: `Đổi mật khẩu`,
      children: <ChangePassword handleCancel={handleCancel}></ChangePassword>,
    },
  ];
  return (
    <div className="w-full flex ">
      <AiOutlineMenu className="menu-icon" onClick={showDrawer} />
      <Drawer
        title="Menu Chức Năng"
        placement={placement}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <div>Quản Lí Tài Khoản</div>
        <div>Đăng Xuất</div>
      </Drawer>
      <div className="flex w-full">
        <div className="logo flex  text-[#0065ff] items-center">
          <div className="cursor-pointer">
            <DiReact
              onClick={() => {
                navigate("/");
              }}
              className="react-icon text-[40px]"
            />
          </div>
          <span
            onClick={() => {
              navigate("/");
            }}
            className="logo cursor-pointer"
          >
            ProjectHUST
          </span>
        </div>
        <div className="w-[80%]">
          <Search
            className="w-full"
            onChange={(e) => props.setSearchTerm(e.target.value)}
            placeholder="Bạn tìm gì hôm nay"
            onSearch={onSearch}
          />
        </div>
        <div className="flex items-center">
          <div className="cart">
            <Popover
              placement="bottomRight"
              title={text}
              content={content}
              arrow={mergedArrow}
            >
              <Badge count={orderNumber}>
                <ShoppingCartOutlined
                  shape="square"
                  size="large"
                  className="text-[40px] text-[#0065ff]"
                />
              </Badge>
            </Popover>
          </div>
          <div>
            {login === true ? (
              <Space nowrap="true" style={{}}>
                <Avatar
                  className="text-[15px]"
                  src={<img src={urlAvatar} alt="avatar" />}
                />
                <Select
                  value={selectValue}
                  bordered={false}
                  options={options}
                  onChange={(value) => {
                    if (value === "Đăng Xuất") {
                      setSelectValue("Đăng Xuất");
                      handleLogOut();
                    }
                    if (value === "Trang Quản Trị") {
                      setSelectValue("Trang Quản Trị");
                      navigate("/admin");
                    }
                    if (value === "Lịch sử mua hàng") {
                      navigate("/historyorder");
                      setSelectValue("Lịch sử mua hàng");
                    }
                    if (value === "Quản lí tài khoản") {
                      setSelectValue("Quản lí tài khoản");
                      showModal();
                    }
                  }}
                />
              </Space>
            ) : (
              <div
                className="border border-[#0065ff] bg-[#cce1ff] rounded-[10px] p-[10px] text-center text-[10px] text-[#0065ff] ml-[10px] cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </div>
            )}
          </div>
        </div>
        <Modal
          width={"600px"}
          title="Quản lí tài khoản"
          open={isModalOpen}
          footer={null}
          // onOk={handleOk}
          onCancel={handleCancel}
        >
          <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} />
        </Modal>
      </div>
    </div>
  );
};

export default Header;
