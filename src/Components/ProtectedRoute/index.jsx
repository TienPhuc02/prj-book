import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";
const RoleBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  console.log("🚀 ~ file: index.jsx:8 ~ RoleBaseRoute ~ user:", user)
  const isRole = user.role.name;
  if (
    (isAdminRoute && isRole === "ADMIN") ||
    (!isAdminRoute && (isRole === "USER" || isRole === "ADMIN"))
  ) {
    return <>{props.children}</>;
  } else {
    return (
      <>
        <NotPermitted></NotPermitted>
      </>
    );
  }
};
const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  return (
    <div>
      {isAuthenticated === true ? (
        <>
          <RoleBaseRoute>{props.children}</RoleBaseRoute>
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default ProtectedRoute;
