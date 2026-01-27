import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const userRole = localStorage.getItem("role");

    if (!userRole) {
        return <Navigate to={getLoginRoute(role)} replace />;
    }

    if (userRole !== role) {
        return <Navigate to={getLoginRoute(role)} replace />;
    }

    return children;
}

function getLoginRoute(role) {
    switch (role) {
        case "Admin":
            return "/admin/login";
        case "Investigator":
            return "/investigator/login";
        default:
            return "/login"; // User
    }
}
