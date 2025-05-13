import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import User from "../../../../../../models/User";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

export async function POST(req: Request) {
  const { userId } = await req.json();
  
  await connectDB();

  const secret = speakeasy.generateSecret({
    name: `NextAuth2FA (${userId})`,
  });

  const url = await qrcode.toDataURL(secret.otpauth_url!);

  await User.findByIdAndUpdate(userId, {
    totpSecret: secret.base32,
    is2FAEnabled: true,
  });

  return NextResponse.json({ qrCodeUrl: url });
}
