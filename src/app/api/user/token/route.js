
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { resHandler } from "../../../../../utils/messageHandler";

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
          return resHandler(401, "Unauthorized! No token provided.");
        }
        const verify = jwt.verify(token, "secretKeyanyRandomString");
     return resHandler(200, "Token is valid", verify);

    } catch (error) {
      return resHandler(401, "Unauthorized! Invalid token.");
    }

}