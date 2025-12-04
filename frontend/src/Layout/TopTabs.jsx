import React from "react";
import { NavLink } from "react-router-dom";
import "./index.css";

const TopTabs = () => {
  return (
    <div className="top-tabs">
      <NavLink to="/builder/build" className="tab">BUILD</NavLink>
      <NavLink to="/builder/train" className="tab">TRAIN</NavLink>
      <NavLink to="/builder/publish" className="tab">PUBLISH</NavLink>
    </div>
  );
};

export default TopTabs;
