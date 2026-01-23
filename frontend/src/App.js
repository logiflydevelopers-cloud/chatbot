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

/* ================= SETTINGS ================= */
import SettingsLayout from "./Layout/Settings/SettingsLayout";
import Account from "./Layout/Settings/Account";
import Security from "./Layout/Settings/Security";

/* ================= ADMIN ================= */
import AdminLayout from "./Layout/Admin-Console/AdminLayout";
import Dashboard from "./Layout/Admin-Console/Dashboard";
import Goals from "./Layout/Admin-Console/Goals";
import Campaigns from "./Layout/Admin-Console/Campaigns";
import Customers from "./Layout/Admin-Console/Customers";
import CustomerChat from "./Layout/Admin-Console/CustomerChat";

/* ================= SUPPORT ================= */
import ContactSupport from "./Layout/ContactSupport";
import FAQPage from "./Layout/FAQPage";
import PricingPage from "./Layout/PricingPage";
import BlogPage from "./Layout/Blog/BlogPage";
import BlogDetail from "./Layout/Blog/BlogDetail";

import Terms from "./Layout/Footer/Terms";
import Privacy from "./Layout/Footer/Privacy";
import About from "./Layout/Footer/About";







import "./App.css";

axios.defaults.withCredentials = true;

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* 🔥 Restore user */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  /* ❌ HEADER HIDE ROUTES */
  const hideHeaderRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/contact-support",
    "/faq",
  ];

  const shouldHideHeader =
    hideHeaderRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/embed/chat")

  if (authLoading) return null;

  return (
    <>
      {/* HEADER */}
      {!shouldHideHeader && user && (
        <Header user={user} setUser={setUser} />
      )}

      <main className="main-content">
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* SUPPORT */}
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />


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

          {/* CHATBOT */}
          <Route
            path="/custom-chat"
            element={
              <ProtectedRoute user={user}>
                <CustomChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/embed-code/:userId"
            element={
              <ProtectedRoute user={user}>
                <EmbedCodePage user={user} />
              </ProtectedRoute>
            }
          />

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
            <Route path="knowledge/add-website" element={<AddWebsiteForm user={user} />} />
            <Route path="teach" element={<TeachAgent user={user} />} />
            <Route path="voice-agent" element={<VoiceAgent />} />
          </Route>

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute user={user}>
                <SettingsLayout user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<Account />} />
            <Route path="security" element={<Security />} />
          </Route>

          {/* ADMIN CONSOLE */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard/:userId" element={<Dashboard />} />
            <Route path="goals/:userId" element={<Goals />} />
            <Route path="campaigns/:userId" element={<Campaigns />} />
            <Route path="customers/:userId" element={<Customers />} />
            <Route path="customers/:userId/:id" element={<CustomerChat />} />
          </Route>

        </Routes>

        {/* DATA DISPLAY */}
        {!location.pathname.startsWith("/embed/chat") && <DataDisplay />}
      </main>
    </>
  );
}

/* ROOT */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
