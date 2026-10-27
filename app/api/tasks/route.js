import client from "@/lib/mongodb";

export async function GET() {
  try {
    await client.connect();

    const db = client.db("Task-Manager");

    const tasks = await db
      .collection("tasks")
      .find({})
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

export async function POST(request) {
  try {
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