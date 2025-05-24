

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { connectDb } from "../../../../../config/connectDb";
import { User } from "../../../../../model/userModel";
import { resHandler } from "../../../../../utils/messageHandler";

export async function POST(req) {
  try {
  await connectDb();

    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return resHandler( 400, "Please fill all fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return resHandler( 400, "User already exists with this email");
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
  return resHandler(500, "Server Error! Please try again later.");
  }
}
