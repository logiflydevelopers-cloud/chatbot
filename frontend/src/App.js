import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
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

import "./App.css";

axios.defaults.withCredentials = true;

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* ================= APP CONTENT ================= */
function AppContent() {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* 🔥 RESTORE USER ON APP LOAD */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isEmbedChat = location.pathname.startsWith("/embed/chat");

  if (authLoading) return null; // 🔥 prevents header flicker

  return (
    <>
      {/* ✅ HEADER ONLY ON DASHBOARD */}
      {user && isDashboardRoute && (
        <Header user={user} setUser={setUser} />
      )}

      <main className="main-content">
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* AUTH */}
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route path="/google-success" element={<GoogleSuccess setUser={setUser} />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* USER DETAILS */}
          <Route
            path="/userDetails/:userId"
            element={
              <ProtectedRoute user={user}>
                <UserDetails user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* CUSTOM CHAT */}
          <Route
            path="/custom-chat"
            element={
              <ProtectedRoute user={user}>
                <CustomChatPage />
              </ProtectedRoute>
            }
          />

          {/* EMBED CODE */}
          <Route
            path="/embed-code/:userId"
            element={
              <ProtectedRoute user={user}>
                <EmbedCodePage user={user} />
              </ProtectedRoute>
            }
          />

          {/* EMBED CHAT (NO HEADER) */}
          <Route path="/embed/chat/:userId" element={<ChatBotDrawerEmbed />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <DashboardLayout user={user} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="knowledge" replace />} />
            <Route path="train" element={<Welcome />} />

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

        {/* DATA DISPLAY (NOT FOR EMBED) */}
        {!isEmbedChat && <DataDisplay />}
      </main>
    </>
  );
}

/* ================= ROOT ================= */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
