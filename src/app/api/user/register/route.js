

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { connectDb } from "../../../../../config/connectDb";
import { User } from "../../../../../model/userModel";

export async function POST(req) {
  try {
  await connectDb();

    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return Response.json({ message: "Please fill all fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, "secretKeyanyRandomString", {
      expiresIn: "48h",
    });

    const response = Response.json(
      { message: "User Created Successfully", token },
      { status: 201 }
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${48 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ message: "Server Error" }, { status: 500 });
  }
}
