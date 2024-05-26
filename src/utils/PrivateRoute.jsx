import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
    let { user } = useAuth();
    return <div>{user ? <Outlet /> : <Navigate to="/login" />}</div>;
};

export default PrivateRoute;
