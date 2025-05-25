import { connectDb } from "../../../../../config/connectDb";
import { Todo } from "../../../../../model/todoModel";
import { resHandler } from "../../../../../utils/messageHandler";

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();
    const { title, description, user, completed = false } = body;

    if (!title || !description || !user) {
      return resHandler(400, "Title, description and user are required");
    }

    const todo = await Todo.create({ title, description, user, completed });

    return new Response(JSON.stringify(todo), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating todo:", error); 
    return resHandler(500, "Server Error! Please try again later.");
  }
}
