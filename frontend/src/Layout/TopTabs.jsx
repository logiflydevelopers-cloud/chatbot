import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

const TopTabs = () => {
  const navigate = useNavigate();

  const handleTrainClick = async (e) => {
    e.preventDefault(); // ⛔ stop NavLink default

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id || user?.userId;

      if (!userId) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `http://localhost:4000/api/chatbot/knowledge-status/${userId}`
      );

      if (res.data.hasKnowledge) {
        navigate("/builder/train");
      } else {
        alert("⚠️ Please upload FILE, LINK or add Q&A first.");
        navigate("/dashboard/knowledge");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="top-tabs">
      <NavLink to="/builder/build" className="tab">
        BUILD
      </NavLink>

      {/* ⭐ TRAIN = GUARDED */}
      <NavLink
        to="/builder/train"
        className="tab"
        onClick={handleTrainClick}
      >
        TRAIN
      </NavLink>

      <NavLink to="/builder/publish" className="tab">
        PUBLISH
      </NavLink>
    </div>
  );
};

export default TopTabs;
