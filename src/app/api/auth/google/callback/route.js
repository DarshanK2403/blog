import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
  const code = new URL(request.url).searchParams.get("code");

  if (!code) return NextResponse.redirect("http://localhost:3000");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: "http://localhost:3000/api/auth/google/callback",
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  const access_token = tokenData.access_token;

  // ✅ Get Google Profile
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const profile = await profileRes.json();

  await dbConnect();

  // ✅ Check or Create User
  let user = await User.findOne({ email: profile.email });
  if (!user) {
    const allowedEmails = ["darshandeesa2403@gmail.com"]; // you can check DB too
    if (!allowedEmails.includes(profile.email)) {
      return NextResponse.redirect("http://localhost:3000?error=unauthorized");
    }

    user = await User.create({
      name: profile.name,
      email: profile.email,
      googleId: profile.sub,
      role: "admin",
    });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // ✅ Set Cookie
  const response = NextResponse.redirect("http://localhost:3000/");
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 2,
  });

  return response;
}
