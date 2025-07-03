import { verifyAuthToken } from "./verifyToken";
import { NextResponse } from "next/server";

export function requireAdmin(request) {
  const user = verifyAuthToken(request);

  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  return user; // valid admin user object
}
