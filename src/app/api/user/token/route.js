import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { resHandler } from "../../../../../utils/messageHandler";

export async function GET() {
  try {
    // Await the cookies() call to avoid runtime error
    const cookieStore = await cookies();  // ✅ Await this in dynamic API routes

    // Now safely get the cookie
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return resHandler(401, "Unauthorized! No token provided.");
    }

    // Verify the JWT token
    const verify = jwt.verify(token, "secretKeyanyRandomString");

    return resHandler(200, "Token is valid", verify);
  } catch (error) {
    return resHandler(401, "Unauthorized! Invalid token.");
  }
}
