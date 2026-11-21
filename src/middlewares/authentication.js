import jwt from "jsonwebtoken";
import "dotenv/config";

export const authentication = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authorization);
  if (!match) {
    return res.status(403).json({ message: "Formato de autorización inválido" });
  }

  jwt.verify(match[1], process.env.JWT_SECRET_KEY, (err) => {
    if (err) return res.status(403).json({ message: "Token inválido o expirado" });
    next();
  });
};