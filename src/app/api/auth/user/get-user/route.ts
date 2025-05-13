import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import User from "../../../../../../models/User";

export async function POST(req: Request) {
  const { userId } = await req.json();
  await connectDB();

  const user = await User.find({ _id: userId });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  return NextResponse.json(user[0]);
}
