import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (userData) => {
  const user = { id: userData.id, email: userData.email };
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};
