import { authenticate } from "../services/auth.service.js";
import { generateToken } from "../utils/token-generator.js";

const default_user = {
  id: 1,
  email: "admin@gmail.com",
  password: "123456",
};

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(400).json({ message: "Se requieren email y password" });
  }

  if (!authenticate(email, password, default_user)) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = generateToken({ id: default_user.id, email: default_user.email });
  return res.json({ token });
}
