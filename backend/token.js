import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }  // 15 minutes
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }   // 7 days
  );
};
