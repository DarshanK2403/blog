import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { email, name } = await request.json();

  const isAdmin = email === "admin@example.com";

  if (!isAdmin) {
    return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
  }

  // ✅ Create JWT
  const token = jwt.sign(
    { email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // ✅ Set token as cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return response;
}
