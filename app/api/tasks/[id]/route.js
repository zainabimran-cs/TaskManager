import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT: Update task title
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (
      typeof body.title !== "string" ||
      !body.title.trim()
    ) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    await client.connect();

    const result = await client
      .db("Task-Manager")
      .collection("tasks")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { title: body.title.trim() } }
      );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Task title updated successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// PATCH: Mark task complete or incomplete
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (typeof body.completed !== "boolean") {
      return Response.json(
        { error: "Invalid completed value" },
        { status: 400 }
      );
    }

    await client.connect();

    const result = await client
      .db("Task-Manager")
      .collection("tasks")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { completed: body.completed } }
      );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update task status" },
      { status: 500 }
    );
  }
}

// DELETE: Remove task
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    await client.connect();

    const result = await client
      .db("Task-Manager")
      .collection("tasks")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
