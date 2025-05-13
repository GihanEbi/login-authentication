import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import User from '../../../../../models/User';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectDB();

  const hashedPassword = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: 'User exists' }, { status: 400 });

  const user = await User.create({ email, password: hashedPassword });
  return NextResponse.json({ user });
}
