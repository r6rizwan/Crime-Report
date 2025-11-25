import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Home from "./Components/Home";
import Register from "./Components/Register";
import OtpVerify from "./Components/OtpVerify";
import Login from "./Components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpVerify />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
