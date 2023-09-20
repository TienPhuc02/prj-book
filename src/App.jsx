import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import LoginPage from "./Pages/Login";
import UserPage from "./Pages/user";
import BookPage from "./Pages/book";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import RegisterPage from "./Pages/Register";
import { callAllBooks, callFetchAccount } from "./service/api";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./Components/Loading";
import { Button, Result } from "antd";
import AdminPage from "./Pages/admin";
import ProtectedRoute from "./Components/ProtectedRoute";
import ManageOrder from "./Pages/ManageOrder";
import AdminComponent from "./Components/Admin";
import BookDetail from "./Pages/bookDetail";
import ViewOrder from "./Pages/vieworder";
import HistoryOrder from "./Pages/historyorder/index";
const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <div className="layout-app">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div>
          <Outlet context={[searchTerm, setSearchTerm]} />
        </div>
      </div>
    </div>
  );
};
const LayoutAdmin = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const isRole = user.role;
  return (
    <div className="layout-app">
      {isAdminRoute && isRole === "ADMIN"}
      <div>
        <AdminPage />
      </div>
      {isAdminRoute && isRole === "ADMIN"}
    </div>
  );
};
export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const isLoading = useSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    if (
      isAuthenticated === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    const res = await callFetchAccount();
    console.log("🚀 ~ file: App.jsx:68 ~ getAccount ~ res:", res);
    if (res && res.data && res.data.data) {
      dispatch(doGetAccountAction(res.data.data));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: (
        <div>
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
              <Link>
                <Button type="primary">Back Home</Button>
              </Link>
            }
          />
        </div>
      ),
      children: [
        { index: true, element: <Home /> },
        {
          path: "book/:slug",
          element: <BookDetail />,
        },
        {
          path: "vieworder",
          element: (
            <ProtectedRoute>
              <ViewOrder />
            </ProtectedRoute>
          ),
        },
        {
          path: "historyorder",
          element: (
            <ProtectedRoute>
              <HistoryOrder />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: (
        <div>
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
              <Link to={"/admin"}>
                <Button type="primary">Back Home</Button>
              </Link>
            }
          />
        </div>
      ),
      children: [
        {
          // index: true,
          element: (
            <ProtectedRoute>
              <AdminPage></AdminPage>
            </ProtectedRoute>
          ),
        },
        {
          path: "book",
          element: <BookPage />,
        },
        {
          index: true,
          path: "",
          element: <AdminComponent />,
        },
        {
          path: "user",
          element: <UserPage />,
        },
        {
          path: "order",
          element: <ManageOrder />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  const protectedRoutes = (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );

  return (
    <div>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/" ||
      window.location.pathname === "/register" ? (
        <RouterProvider router={router}>
          {/* <div>
            {isAuthenticated === true ? (
              protectedRoutes
            ) : (
              <Navigate to="/login" />
            )}
          </div> */}
        </RouterProvider>
      ) : (
        <Loading />
      )}
    </div>
  );
}
