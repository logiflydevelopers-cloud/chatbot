import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import UserDetails from "./Components/Auth/UserDetails";
import Header from "./Layout/Header";
import Home from "./Layout/Home";
import DataDisplay from "./Layout/DataDisplay";
import CustomChatPage from "./Layout/CustomChatPage";
import EmbedCodePage from "./Layout/EmbedCodePage";
import EmbedChatbotFrame from "./Layout/EmbedChatbotFrame";
import AddWebsiteForm from "./Layout/AddWebsiteForm";


import "./Layout/Home.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect embed mode
  const isEmbedMode = window.location.pathname.startsWith("/embed/chat/");

  // Protect all routes
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  // Fetch user on refresh
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch { }
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
      .get(`https://demo-chatbot-backend.vercel.app/api/auth/getUserDetails/${userId}`, {
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
            const refresh = await axios.get("https://demo-chatbot-backend.vercel.app/api/auth/refresh", {
              withCredentials: true,
            });

            const newToken = refresh.data.accessToken;
            localStorage.setItem("accessToken", newToken);

            const retry = await axios.get(
              `https://demo-chatbot-backend.vercel.app/api/auth/getUserDetails/${userId}`,
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px", fontSize: "22px" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      {!isEmbedMode && <Header user={user} setUser={setUser} />}

      <main className={isEmbedMode ? "" : "main-content"}>
        <Routes>

          {/* HOME PAGE (PUBLIC) */}
          <Route path="/" element={<Home user={user} />} />

          {/* ADD WEBSITE PAGE (PROTECTED) */}
          <Route
            path="/add-website"
            element={
              <ProtectedRoute>
                <AddWebsiteForm user={user} />
              </ProtectedRoute>
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/add-website" replace />}
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/add-website" replace />}
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/userDetails/:userId"
            element={
              <ProtectedRoute>
                <UserDetails user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/custom-chat/:userId"
            element={
              <ProtectedRoute>
                <CustomChatPage user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/embed-code/:userId"
            element={
              <ProtectedRoute>
                <EmbedCodePage user={user} />
              </ProtectedRoute>
            }
          />

          {/* PUBLIC EMBED MODE */}
          <Route path="/embed/chat/:userId" element={<EmbedChatbotFrame />} />

        </Routes>



        {!isEmbedMode && <DataDisplay />}
      </main>
    </Router>
  );
}

export default App;
