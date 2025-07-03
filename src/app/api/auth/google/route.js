import { NextResponse } from "next/server";

export async function GET() {
  // Grab the domain from env, with a local fallback
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Build the redirect URI dynamically
  const redirect_uri = `${baseUrl}/api/auth/google/callback`;
  const client_id = process.env.GOOGLE_CLIENT_ID;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${client_id}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

  return NextResponse.redirect(googleAuthUrl);
}
