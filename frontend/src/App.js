import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Home from "./Components/Home";
import Register from "./Components/Register";
import OtpVerify from "./Components/OtpVerify";
import Login from "./Components/Login";
import SetPassword from "./Components/SetPassword";

import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import InvestigatorLayout from "./Layouts/InvestigatorLayout";
import ProtectedRoute from "./ProtectedRoute";

// Dashboards for each role
import UserDashboard from "./Components/UserDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import InvestigatorDashboard from "./Components/InvestigatorDashboard";
import FileComplaint from "./Components/FileComplaint";
import MyComplaints from "./Components/MyComplaints";
import ComplaintDetails from "./Components/ComplaintDetails";
import AdminComplaints from "./Components/AdminComplaints";
import AdminComplaintDetails from "./Components/AdminComplaintDetails";
import ComplaintTracking from "./Components/ComplaintTracking";
import InvestigatorAssignedComplaints from "./Components/InvestigatorAssignedComplaints";
import InvestigatorUpdateStatus from "./Components/InvestigatorUpdateStatus";
import InvestigatorCaseFiles from "./Components/InvestigatorCaseFiles";
import AdminCaseFiles from "./Components/AdminCaseFiles";
import UserProfile from "./Components/UserProfile";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/set-password" element={<SetPassword />} />


        {/* USER ROUTES */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <UserDashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint-tracking"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <ComplaintTracking />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/file-complaint"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <FileComplaint />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <MyComplaints />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint/:id"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <ComplaintDetails />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <UserProfile />
              </UserLayout>
            </ProtectedRoute>
          }
        />


        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminComplaints />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints/:id"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminComplaintDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/case-files/:complaintId"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminCaseFiles />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        {/* INVESTIGATOR ROUTES */}
        <Route
          path="/investigator/dashboard"
          element={
            <ProtectedRoute role="Investigator">
              <InvestigatorLayout>
                <InvestigatorDashboard />
              </InvestigatorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/investigator/assigned"
          element={
            <ProtectedRoute role="Investigator">
              <InvestigatorLayout>
                <InvestigatorAssignedComplaints />
              </InvestigatorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/investigator/update-status/:id"
          element={
            <ProtectedRoute role="Investigator">
              <InvestigatorLayout>
                <InvestigatorUpdateStatus />
              </InvestigatorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/investigator/case-files/:complaintId"
          element={
            <ProtectedRoute role="Investigator">
              <InvestigatorLayout>
                <InvestigatorCaseFiles />
              </InvestigatorLayout>
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>

  );
}

export default App;
