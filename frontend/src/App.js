import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

/* ================= AUTH ================= */
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import UserDetails from "./Components/Auth/UserDetails";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import VerifyOTP from "./Components/Auth/VerifyOTP";
import ResetPassword from "./Components/Auth/ResetPassword";
import GoogleSuccess from "./Components/Auth/GoogleSuccess";

/* ================= LAYOUT ================= */
import Header from "./Layout/Header";
import Home from "./Layout/Home";
import DataDisplay from "./Layout/DataDisplay";
import DashboardLayout from "./Layout/DashboardLayout";

/* ================= DASHBOARD ================= */
import AIPersona from "./Layout/dashboard-pages/AIPersona";
import Knowledge from "./Layout/dashboard-pages/KnowledgeBase";
import TeachAgent from "./Layout/dashboard-pages/TeachAgent/TeachAgent";
import Welcome from "./Layout/dashboard-pages/Welcome";
import AddWebsiteForm from "./Layout/dashboard-pages/AddWebsiteForm";
import FileUpload from "./Layout/dashboard-pages/FileUpload";
import VoiceAgent from "./Layout/dashboard-pages/VoiceAgent";

/* ================= QA ================= */
import QAPage from "./Layout/dashboard-pages/QA/QAPage";
import EditQA from "./Layout/dashboard-pages/QA/EditQA";

/* ================= CHATBOT ================= */
import CustomChatPage from "./Layout/CustomChatPage";
import EmbedCodePage from "./Layout/EmbedCodePage";
import ChatBotDrawerEmbed from "./Layout/ChatBotDrawerEmbed";

import "./Layout/Home.css";
import "./App.css";

axios.defaults.withCredentials = true;

function App() {
  /* 🔑 USER STATE */
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isEmbedMode = window.location.pathname.startsWith("/embed/chat/");
  const hideHeaderOnHome = window.location.pathname === "/";
  const hideHeaderOnEmbed = window.location.pathname.startsWith("/embed/chat/");

  /* ================= PROTECTED ROUTE ================= */
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      {/* HEADER */}
      {user && !hideHeaderOnHome && !hideHeaderOnEmbed && (
        <Header user={user} setUser={setUser} />
      )}

      <main className={isEmbedMode ? "" : "main-content"}>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home user={user} />} />

          {/* AUTH */}
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
          />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* USER PROFILE */}
          <Route
            path="/userDetails/:userId"
            element={
              <ProtectedRoute>
                <UserDetails user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* CUSTOM CHAT */}
          <Route
            path="/custom-chat"
            element={
              <ProtectedRoute>
                <CustomChatPage />
              </ProtectedRoute>
            }
          />

          {/* EMBED CODE */}
          <Route
            path="/embed-code/:userId"
            element={
              <ProtectedRoute>
                <EmbedCodePage user={user} />
              </ProtectedRoute>
            }
          />

          {/* EMBED CHAT */}
          <Route path="/embed/chat/:userId" element={<ChatBotDrawerEmbed />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout user={user} />
              </ProtectedRoute>
            }
          >
            {/* ✅ DEFAULT AFTER LOGIN */}
            <Route index element={<Navigate to="knowledge" replace />} />

            <Route path="train" element={<Welcome />} />

            {/* REDIRECTS */}
            <Route path="customize" element={<Navigate to="/custom-chat" replace />} />
            <Route path="publish" element={<Navigate to={`/embed-code/${user?._id}`} replace />} />

            {/* DASHBOARD PAGES */}
            <Route path="persona" element={<AIPersona />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="knowledge/file" element={<FileUpload />} />
            <Route path="knowledge/qa" element={<QAPage />} />
            <Route path="knowledge/qa/new" element={<EditQA />} />
            <Route path="knowledge/qa/edit/:id" element={<EditQA />} />
            <Route path="add-website" element={<AddWebsiteForm user={user} />} />
            <Route path="teach" element={<TeachAgent user={user} />} />
            <Route path="voice-agent" element={<VoiceAgent />} />
          </Route>
        </Routes>

        {!isEmbedMode && <DataDisplay />}
      </main>
    </Router>
  );
}

export default App;
