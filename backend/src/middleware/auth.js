import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token ausente" });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = data;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export async function meHandler(req, res) {
  if (!req.user) return res.status(401).json({ error: "Não autenticado" });
  const u = await User.findByPk(req.user.id, { attributes: ["id","name","email","role"] });
  res.json({ user: u });
}
