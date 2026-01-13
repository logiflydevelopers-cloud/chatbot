import React, { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import "./ColorPicker.css";

const PRESET_COLORS = [
  "#0066ff",
  "#3b82f6",
  "#d946ef",
  "#f59e0b",
  "#a3e635",
  "#5ad6eb",
  "#8b5cf6",
  "#34d399",
  "#ff0000",
];

const ColorPicker = ({ value, onChange }) => {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="color-picker-wrapper">

      {/* ================= PRESET COLORS ================= */}
      <div className="preset-row">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            className="preset-color"
            style={{ backgroundColor: color }}
            onClick={() => {
              onChange(color);
              setShowCustom(false); // preset click → close custom picker
            }}
          />
        ))}

        {/* ✅ CUSTOM COLOR TOGGLE BUTTON */}
        <button
          className="custom-color-btn"
          onClick={() => setShowCustom((prev) => !prev)}
        >
          Custom color
        </button>
      </div>

      {/* ================= CUSTOM PICKER ================= */}
      {showCustom && (
        <div className="custom-picker-box">
          <HexColorPicker
            color={value}
            onChange={onChange}
          />

          <div className="hex-wrapper">
            <span>#</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              prefixed={false}
            />
          </div>

          {/* OPTIONAL DONE BUTTON */}
          <button
            className="done-btn"
            onClick={() => setShowCustom(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
