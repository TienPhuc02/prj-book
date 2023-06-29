import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  DesktopOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Layout,
  Menu,
  Select,
  Space,
  message,
  theme,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { callLogOut } from "../../service/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
const { Header, Content, Footer, Sider } = Layout;

const AdminPage = () => {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const login = useSelector((state) => state.account.isAuthenticated);
  const isLoading = useSelector((state) => state.account.isLoading);
  const user = useSelector((state) => state.account.user);
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;
  const items = [
    {
      label: <Link to="/admin">DashBoard Admin</Link>,
      icon: <DesktopOutlined />,
    },
    {
      label: <span>Manage Users</span>,
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/admin/user">CRUD</Link>,
          key: "crud",
          icon: <TeamOutlined />,
        },
      ],
    },
    {
      label: <Link to="/admin/book">Manage Book</Link>,
      key: "book",
      icon: <FileOutlined />,
    },
    {
      label: <Link to="/admin/order">Manage Order</Link>,
      key: "order",
      icon: <PieChartOutlined />,
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleLogOut = async () => {
    const res = await callLogOut();
    if (res.data) {
      navigate("/");
      message.success("Đăng xuất thành công");
      dispath(doLogoutAction());
    }
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            color: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Admin
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          {isLoading === false ? (
            <Space wrap style={{ float: "right" }}>
              <Avatar src={<img src={urlAvatar} alt="avatar" />} />
              <Select
                defaultValue={`Welcome ${user.fullName}`}
                style={{
                  width: 170,
                }}
                bordered={false}
                options={[
                  { value: "Trang chủ", label: "Trang chủ" },
                  {
                    value: "Quản lí tài khoản",
                    label: "Quản lí tài khoản",
                  },
                  {
                    value: "Đăng Xuất",
                    label: "Đăng Xuất",
                  },
                ]}
                onChange={(value) => {
                  if (value === "Đăng Xuất") {
                    handleLogOut();
                  }
                  if (value === "Trang chủ") {
                    navigate("/");
                  }
                }}
              />
            </Space>
          ) : (
            <div>Tài Khoản</div>
          )}
        </Header>

        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminPage;
