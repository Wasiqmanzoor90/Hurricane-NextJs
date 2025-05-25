import { connectDb } from "../../../../../config/connectDb";
import { Todo } from "../../../../../model/todoModel";
import { resHandler } from "../../../../../utils/messageHandler";

export async function GET(req)
{
    try {
       await connectDb(); 
       const { searchParams } = new URL(req.url);
       const userId = searchParams.get("userId");
       if(!userId) {
       return resHandler(400, "User ID is required");
       }
       const todo = await Todo.find({user: userId});
       
    return new Response(JSON.stringify(todo), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
        console.error("Error fetching todos:", error);
    return resHandler(500, "Failed to fetch todos");
    }
}