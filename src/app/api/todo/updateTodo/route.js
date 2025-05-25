import { connectDb } from "../../../../../config/connectDb";
import { Todo } from "../../../../../model/todoModel";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ status: 400, message: "Todo ID is required" }, { status: 400 });
    }

    const body = await req.json();

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { ...body },
      { new: true } // return the updated document
    );

    if (!updatedTodo) {
      return NextResponse.json({ status: 404, message: "Todo not found" }, { status: 404 });
    }

    // Return consistent JSON: status, message, data
    return NextResponse.json({
      status: 200,
      message: "Todo updated successfully",
      data: updatedTodo,
    }, { status: 200 });

  } catch (err) {
    console.error("Error updating todo:", err);
    return NextResponse.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
