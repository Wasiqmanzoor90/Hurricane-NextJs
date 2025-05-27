import { connectDb } from "../../../../../config/connectDb";
import { User } from "../../../../../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { resHandler } from "../../../../../utils/messageHandler";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return resHandler(400, "Email and password are required");
    }

    const existUser = await User.findOne({ email });
    if (!existUser) {
      return resHandler(400, "User does not exist with this email");
    }

    const checkPass = await bcrypt.compare(password, existUser.password);
    if (!checkPass) {
      return resHandler(400, "Incorrect password! Please try again.");
    }

    // Password correct, create token
    const userId = existUser._id;
    const token = jwt.sign({ userId }, "secretKeyanyRandomString", {
      expiresIn: "48h",
    });

    const expire = new Date(Date.now() + 48 * 60 * 60 * 1000).toUTCString();

    return new Response(
      JSON.stringify({
        message: "User Login Successfully!", token, user: {
          _id: existUser._id,
          username: existUser.username,
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Strict; Expires=${expire}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return resHandler(500, "Server Error! Please try again later.");
  }
}
