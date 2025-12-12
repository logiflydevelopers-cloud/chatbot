import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Auth Pages
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import UserDetails from "./Components/Auth/UserDetails";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import VerifyOTP from "./Components/Auth/VerifyOTP";
import ResetPassword from "./Components/Auth/ResetPassword";
import GoogleSuccess from "./Components/Auth/GoogleSuccess";   // ⭐ NEW IMPORT

// Layout
import Header from "./Layout/Header";
import Home from "./Layout/Home";
import DataDisplay from "./Layout/DataDisplay";
import DashboardLayout from "./Layout/DashboardLayout";

// Dashboard Subpages
import AIPersona from "./Layout/dashboard-pages/AIPersona";
import Knowledge from "./Layout/dashboard-pages/KnowledgeBase";
import TeachAgent from "./Layout/dashboard-pages/TeachAgent/TeachAgent";
import Welcome from "./Layout/dashboard-pages/Welcome";
import AddWebsiteForm from "./Layout/dashboard-pages/AddWebsiteForm";
import FileUpload from "./Layout/dashboard-pages/FileUpload";

// QA Pages
import QAPage from "./Layout/dashboard-pages/QA/QAPage";
import EditQA from "./Layout/dashboard-pages/QA/EditQA";

// Chatbot Customization
import CustomChatPage from "./Layout/CustomChatPage";
import EmbedCodePage from "./Layout/EmbedCodePage";
import ChatBotDrawerEmbed from "./Layout/ChatBotDrawerEmbed";

import "./Layout/Home.css";
import "./App.css";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEmbedMode = window.location.pathname.startsWith("/embed/chat/");

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  /* -----------------------------------------------------------
     🔥 GET USER from token & localStorage
  ------------------------------------------------------------*/
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }

    if (!token) {
      setLoading(false);
      return;
    }

    let decoded = null;
    try {
      decoded = JSON.parse(atob(token.split(".")[1]));
    } catch {
      localStorage.removeItem("accessToken");
      setLoading(false);
      return;
    }

    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      localStorage.removeItem("accessToken");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:4000/api/auth/getUserDetails/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setLoading(false);
      })
      .catch(async (err) => {
        if (err.response?.status === 401) {
          try {
            const refresh = await axios.get("http://localhost:4000/api/auth/refresh", {
              withCredentials: true,
            });

            const newToken = refresh.data.accessToken;
            localStorage.setItem("accessToken", newToken);

            const retry = await axios.get(
              `http://localhost:4000/api/auth/getUserDetails/${userId}`,
              { headers: { Authorization: `Bearer ${newToken}` } }
            );

            setUser(retry.data);
            localStorage.setItem("user", JSON.stringify(retry.data));
          } catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
        setLoading(false);
      });
  }, []);

  /* -----------------------------------------------------------
     🔄 LOADING SCREEN
  ------------------------------------------------------------*/
  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px", fontSize: "22px" }}>
        Loading...
      </div>
    );
  }

  const hideHeaderOnHome = window.location.pathname === "/";
  const hideHeaderOnEmbed = window.location.pathname.startsWith("/embed/chat/");

  /* -----------------------------------------------------------
     ⭐ CUSTOMIZE ACCESS LOGIC
  ------------------------------------------------------------*/
  const canCustomize =
    localStorage.getItem("uploadedWebsite") ||
    localStorage.getItem("hasPDF") ||
    localStorage.getItem("hasQA");

  /* -----------------------------------------------------------
     ⭐ PUBLISH ACCESS LOGIC
  ------------------------------------------------------------*/
  const canPublish = localStorage.getItem("chatbotSaved");

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

          {/* LOGIN */}
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />}
          />

          {/* ⭐ GOOGLE LOGIN SUCCESS ROUTE */}
          <Route path="/google-success" element={<GoogleSuccess />} />

          {/* REGISTER */}
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
          />

          {/* USER DETAILS */}
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
            path="/custom-chat/:userId"
            element={
              <ProtectedRoute>
                <CustomChatPage user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* EMBED CODE */}
          <Route
            path="/embed-code/:userId"
            element={
              <ProtectedRoute>
                <EmbedCodePage user={user} />
              </ProtectedRoute>
            }
          />

          {/* PUBLIC EMBED CHAT */}
          <Route path="/embed/chat/:userId" element={<ChatBotDrawerEmbed />} />

          {/* DASHBOARD ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout user={user} />
              </ProtectedRoute>
            }
          >
            {/* Default → TRAIN */}
            <Route index element={<Navigate to="train" replace />} />

            {/* TRAIN */}
            <Route path="train" element={<Welcome />} />

            {/* CUSTOMIZE */}
            <Route
              path="customize"
              element={
                canCustomize ? (
                  <Navigate to={`/custom-chat/${user?._id}`} replace />
                ) : (
                  <div style={{ padding: 30, color: "red", fontSize: 18 }}>
                    ⚠️ Please upload FILE, LINK, or add Q&A first from Knowledge Base.
                  </div>
                )
              }
            />

            {/* PUBLISH */}
            <Route
              path="publish"
              element={
                canPublish ? (
                  <Navigate to={`/embed-code/${user?._id}`} replace />
                ) : (
                  <div style={{ padding: 30, color: "red", fontSize: 18 }}>
                    ⚠️ Please customize and SAVE your chatbot before publishing.
                  </div>
                )
              }
            />

            {/* SIDEBAR PAGES */}
            <Route path="persona" element={<AIPersona />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="knowledge/file" element={<FileUpload />} />
            <Route path="add-website" element={<AddWebsiteForm user={user} />} />

            {/* TEACH */}
            <Route path="teach" element={<TeachAgent user={user} />} />

            {/* Q&A */}
            <Route path="knowledge/qa" element={<QAPage />} />
            <Route path="knowledge/qa/new" element={<EditQA />} />
            <Route path="knowledge/qa/edit/:id" element={<EditQA />} />
          </Route>
        </Routes>

        {!isEmbedMode && <DataDisplay />}
      </main>
    </Router>
  );
}

export default App;
