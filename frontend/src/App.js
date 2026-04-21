import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Home from "./Components/public/Home";
import Register from "./Components/auth/Register";
import OtpVerify from "./Components/auth/OtpVerify";
import Login from "./Components/auth/Login";
import SetPassword from "./Components/auth/SetPassword";
import ForgotPassword from "./Components/auth/ForgotPassword";
import OtpScreen from "./Components/auth/OtpScreen";
import ResetPassword from "./Components/auth/ResetPassword";

import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import InvestigatorLayout from "./Layouts/InvestigatorLayout";
import ProtectedRoute from "./ProtectedRoute";

// Dashboards for each role
import UserDashboard from "./Components/user/UserDashboard";
import AdminDashboard from "./Components/admin/AdminDashboard";
import InvestigatorDashboard from "./Components/investigator/InvestigatorDashboard";
import FileComplaint from "./Components/user/FileComplaint";
import MyComplaints from "./Components/user/MyComplaints";
import ComplaintDetails from "./Components/user/ComplaintDetails";
import AdminComplaints from "./Components/admin/AdminComplaints";
import AdminComplaintDetails from "./Components/admin/AdminComplaintDetails";
import ComplaintTracking from "./Components/user/ComplaintTracking";
import InvestigatorAssignedComplaints from "./Components/investigator/InvestigatorAssignedComplaints";
import InvestigatorUpdateStatus from "./Components/investigator/InvestigatorUpdateStatus";
import InvestigatorCaseFiles from "./Components/investigator/InvestigatorCaseFiles";
import AdminCaseFiles from "./Components/admin/AdminCaseFiles";
import UserProfile from "./Components/user/UserProfile";
import AdminInvestigators from "./Components/admin/AdminInvestigators";
import AdminAddInvestigator from "./Components/admin/AdminAddInvestigator";
import InvestigatorProfile from "./Components/investigator/InvestigatorProfile";
import AboutPage from "./Components/public/AboutPage";
import ContactPage from "./Components/public/ContactPage";
import SuperAdminLogin from "./Components/superAdmin/SuperAdminLogin";
import AdminManager from "./Components/superAdmin/AdminManager";


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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verify" element={<OtpScreen />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/aboutpage" element={<AboutPage />} />
        <Route path="/contactpage" element={<ContactPage />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin/admins" element={<AdminManager />} />

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
          path="/admin/investigators"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminInvestigators />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-investigator"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminAddInvestigator />
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

        <Route
          path="/investigator/profile"
          element={
            <ProtectedRoute role="Investigator">
              <InvestigatorLayout>
                <InvestigatorProfile />
              </InvestigatorLayout>
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>

  );
}

export default App;
