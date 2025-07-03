// lib/verifyToken.js
import jwt from "jsonwebtoken";

export function verifyAuthToken(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // contains { email, role, userId }
  } catch (err) {
    return null;
  }
}
