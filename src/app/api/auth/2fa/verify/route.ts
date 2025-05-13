import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import User from "../../../../../../models/User";
import speakeasy from "speakeasy";

export async function POST(req: Request) {
  const { userId, token } = await req.json();
  await connectDB();

  const user = await User.findById(userId);
  console.log(user, token);

  if (!user || !user.totpSecret)
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });

  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: "base32",
    token,
    window: 1,
  });
  console.log("Verifying:", verified);
  console.log("Verifying token:", token);
  console.log("Using secret:", user.totpSecret);
  if (!verified)
    return NextResponse.json({ error: "Invalid TOTP" }, { status: 401 });

  return NextResponse.json({ authenticated: true });
}
