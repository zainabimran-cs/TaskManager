import client from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return Response.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    await client.connect();

    const db = client.db("Task-Manager");

    const tasks = await db
      .collection("tasks")
      .find({ userEmail: session.user.email })
      .toArray();

    return Response.json(tasks);
  } catch (error) {
    console.error("Database error:", error);

    return Response.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// Backend pehle poochta hai “kaun login hai?” (getServerSession).
// .find({ userEmail: session.user.email }), yani sirf us user ke tasks aayenge.

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return Response.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    await client.connect();

    const db = client.db("Task-Manager");

    const newTask = {
      title: body.title.trim(),
      completed: false,
      createdAt: new Date(),
      userEmail: session.user.email,
    };

    const result = await db
      .collection("tasks")
      .insertOne(newTask);

    return Response.json(
      {
        message: "Task added successfully",
        task: { ...newTask, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);

    return Response.json(
      { error: "Failed to add task" },
      { status: 500 }
    );
  }
}



// Next.js mein app/api/tasks/route.js hamara backend API route hoga. Iske zariye hum database se tasks read aur save karwa sakenge.