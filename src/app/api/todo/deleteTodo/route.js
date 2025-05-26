import { NextResponse } from "next/server";
import { connectDb } from "../../../../../config/connectDb";
import { Todo } from "../../../../../model/todoModel";

export async function DELETE(req) {
    try {
        await connectDb();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ status: 400, message: "Todo ID is required" }, { status: 400 });
        }
        const deleteTodo = await Todo.findByIdAndDelete(id);
        if (!deleteTodo) {
            return NextResponse.json({ status: 404, message: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json(
            { status: 200, message: "Todo deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { status: 500, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}